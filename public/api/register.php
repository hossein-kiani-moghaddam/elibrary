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
require_once "lib/HkmExceptions.php";
require_once "eldb.php";

require_once "setup.php";
require_once "lib/log.php";
$logger = new Logger(LOG_FILE);
$logger->log("_____ start logging register");

try{

	if($_SERVER['REQUEST_METHOD'] != "POST"){
		throw new HkmResponseException(1, [
			"etc" => ["Page not found!"],
		]);
	}

	$validator = rakitValidator(eldb());

	$validation = $validator->make($_POST, [
    "userName" => "required|unique:Users,userName",
    "email" => "required|email|unique:Users,email",
    "password" => "required|min:6",
    "retypePassword" => "required|same:password"
	]);

	$validation->validate();

	if($validation->fails()){
		throw new HkmResponseException(2, $validation->errors()->toArray());
	}

	$data = arrayOnly($_POST, ["userName", "email"]);

	try{
		eldb()->begin_transaction();
		$data['hashPassword'] = password_hash($_POST['password'], PASSWORD_BCRYPT);
		$data['id'] = insertIntoTable(eldb(), "Users", $data);
		eldb()->commit();

		echo json_encode([
			"result" => 0,
			"data" => $data
		]);
	}
	catch(mysqli_sql_exception $se){
		eldb()->rollback();
		throw new HkmResponseException(3, [
			"etc" => ["SQL Error!"]
		]);
	}
}
catch(HkmResponseException $re){
  echo json_encode($re->getResponse());
}
catch(Exception $e){
	echo json_encode([
		"result" => 9,
		"errors" => [
			"etc" => ["Server error!"],
		],
	]);
}
