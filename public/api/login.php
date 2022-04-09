<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "setup.php";
require_once "lib/validate.php";
require_once "lib/lib.php";
require_once "lib/JwtHandler.php";
require_once "eldb.php";

require_once "setup.php";
require_once "lib/log.php";
$logger = new Logger(LOG_FILE);
$logger->log("_____ start logging login");

$response = [];
try{
	$errors = [
		"etc" => []
	];

	if($_SERVER['REQUEST_METHOD'] != "POST"){
		$response = response(0, 404, "Page Not Found!");
		throw new Exception();
	}

	$receivedData = json_decode(file_get_contents("php://input"));
	$data = [];
	$data['email'] = validate("email", $receivedData->email, "email", $errors['etc']);
	$data['password'] = validate("password", $receivedData->password, "string", $errors['etc']);

	if(hasError($errors)){
		$response = response(0, 422, "Invalid data!", ["errors" => $errors]);
		throw new Exception();
	}

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
					"success" => 1,
					"message" => "You have successfully logged in.",
					"data" => [
						"token" => $token
					]
				];
			}
			else{ // INVALID PASSWORD
				$response = response(0, 422, "Invalid Password!");
			}
		}
		else{ // USER IS NOT FOUNDED BY EMAIL
			$response = response(0, 422, "Invalid Email Address!");
		}

		echo json_encode($response);
	}
	catch(mysqli_sql_exception $se){
		eldb()->rollback();
		$response = response(0, 500, $se->getMessage());
		throw new Exception();
	}
}
catch(Exception $e){
	if($e->getMessage() !== ""){
		$errors['etc']['Error ' . ($e->getCode())] = $e->getMessage();
	}
	$response = array_merge($response, ["errors" => $errors]);

  echo json_encode($response);
}
