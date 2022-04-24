<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "vendor/autoload.php";
require_once "setup.php";
require_once "lib/lib.php";
require_once "lib/validator.php";
require_once "lib/JwtHandler.php";
require_once "lib/HkmExceptions.php";
require_once "eldb.php";

require_once "lib/log.php";
$logger = new Logger(LOG_FILE);
$logger->log("_____ start logging login");

$response = [];
try{

	if($_SERVER['REQUEST_METHOD'] != "POST"){
		throw new HkmResponseException(1, [
			"etc" => [
				"etc1" => "Page not found!"
			],
		]);
	}

	$validator = rakitValidator(eldb());

	$validation = $validator->make($_POST, [
		"email" => "required|email",
		"password" => "required|min:6",
	]);

	$validation->validate();

	if($validation->fails()){
		throw new HkmResponseException(1, $validation->errors()->toArray());
	}

	$data = arrayOnly($_POST, ["email", "password"]);

	try{
		$stmt = eldb()->prepare("
			SELECT *
			FROM Users
			WHERE email = ?
		");
		$stmt->bind_param("s", $data['email']);
		$stmt->execute();
		$result = $stmt->get_result();

		// IF THE USER IS FOUNDED BY EMAIL
		if($row = $result->fetch_assoc()){
			$checkPassword = password_verify($data['password'], $row['hashPassword']);

			// VERIFYING THE PASSWORD (IS CORRECT OR NOT?)
			// IF PASSWORD IS CORRECT THEN SEND THE LOGIN TOKEN
			if($checkPassword){
				$jwt = new JwtHandler();
				$token = $jwt->jwtEncodeData(API, ["id" => $row['id']]);
				$response = [
					"result" => 0,
					"data" => [
						"token" => $token
					],
				];
			}
			else{ // INVALID PASSWORD
				$response = [
					"result" => 1,
					"errors" => [
						"password" => [
							"valid" => "Incorrect password!",
						],
					],
				];
			}
		}
		else{ // USER IS NOT FOUNDED BY EMAIL
			$response = [
				"result" => 1,
				"errors" => [
					"email" => [
						"valid" => "Email address not found!",
					],
				],
			];
		}
	}
	catch(mysqli_sql_exception $se){
		eldb()->rollback();
		throw new HkmResponseException(1, [
			"etc" => [
				"etc1" => "SQL Error!"
			]
		]);
	}

	echo json_encode($response);
}
catch(HkmResponseException $re){
  echo json_encode($re->getResponse());
}
catch(Exception $e){
	echo json_encode([
		"result" => 1,
		"errors" => [
			"etc" => [
				"etc1" => "Server error!",
			],
		],
	]);
}
