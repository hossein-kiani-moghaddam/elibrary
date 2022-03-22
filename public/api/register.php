<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "setup.php";
require_once "lib/validate.php";
require_once "lib/lib.php";
require_once "eldb.php";

require_once "lib/log.php";
$logger = new Logger("../../../temp_elibrary.log");
$logger->log("_____ start logging register");

$response = [];
try{
	$errors = [
		"save" => [],
		"etc" => []
	];

	if($_SERVER['REQUEST_METHOD'] != "POST"){
		$response = response(0, 404, "Page Not Found!");
		throw new Exception();
	}

	$receivedData = json_decode(file_get_contents("php://input"));
	$data = [];
	$data['userName'] = validate("userName", $receivedData->userName, "string", $errors['save']);
	$data['email'] = validate("email", $receivedData->email, "email", $errors['save']);
	$password = validate("password", $receivedData->password, "string", $errors['save']);

	// email should not already be existed:
	if(!array_key_exists("email", $errors['save'])){
		$stmt = eldb()->prepare("
			SELECT email
			FROM Users
			WHERE email = ?
		");
		$stmt->bind_param("s", $data['email']);
		$stmt->execute();
		$result = $stmt->get_result();
		if($row = $result->fetch_assoc()){ // email already exists:
			$errors['save']['email'] = "invalid";
		}
	}

	// Check passwords:
	if(!array_key_exists("password", $errors['save'])){
		if(strlen($password) < 6){
			$errors['save']['password'] = "invalid";
		}
	}

	if(hasError($errors)){
		$response = response(0, 422, "Invalid data!", ["errors" => $errors]);
		throw new Exception();
	}

	try{
		eldb()->begin_transaction();
		$data['hashPassword'] = password_hash($password, PASSWORD_BCRYPT);
		$data['id'] = insertIntoTable(eldb(), "Users", $data);
		eldb()->commit();

		echo json_encode(response(1, 200, "You have successfully registered.", ["data" => []]));
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
