<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "lib/lib.php";
require_once "lib/validate.php";
require_once "eldb.php";
require_once "Auth.php";

require_once "lib/log.php";
$logger = new Logger("../../../temp_elibrary.log");
$logger->log("_____ start logging editFavorite");

try{
  $errors = [
		"save" => [],
    "etc" => [],
  ];

  if($_SERVER['REQUEST_METHOD'] != "POST"){
		throw new Exception("Page Not Found!");
	}

  $userId = NULL;
  $allHeaders = getallheaders();
  $auth = new Auth(eldb(), $allHeaders);
  $valid = $auth->isValid();
  if($valid['success']){
  	$userId = $valid['user']['id'];
  }
  if(!$userId){
    throw new Exception("You must login before adding new books!");
  }

	$data = [];
  $data['userId'] = $userId;
  $data['bookId'] = validateInput(INPUT_POST, "bookId", "int", $errors['save'], ["min_range" => 1]);
  $isFavorite = validateInput(INPUT_POST, "isFavorite", "int", $errors['save'], ["min_range" => 0, "max_range" => 1]);

	if(hasError($errors)){
		throw new Exception();
	}

  eldb()->begin_transaction();

  // Check previous existance:
  $stmt = eldb()->prepare("
    SELECT *
    FROM Favorites
    WHERE userId = ?
      AND bookId = ?
  ");
  $stmt->bind_param("ii", $data['userId'], $data['bookId']);
  $stmt->execute();
  $result = $stmt->get_result();
  $existed = ($result->num_rows > 0);

  if($isFavorite){
    if(!$existed){
      $stmt = eldb()->prepare("
        INSERT INTO Favorites
        SET userId = ?,
          bookId = ?
      ");
      $stmt->bind_param("ii", $data['userId'], $data['bookId']);
      $stmt->execute();
    }
  }
  else{ // !$isFavorite
    if($existed){
      $stmt = eldb()->prepare("
        DELETE FROM Favorites
        WHERE userId = ?
          AND bookId = ?
      ");
      $stmt->bind_param("ii", $data['userId'], $data['bookId']);
      $stmt->execute();
    }
  }

  eldb()->commit();

	echo json_encode([
		"result" => 0,
	]);
}
catch(Exception $e){
  eldb()->rollback();

	if($e->getMessage() !== ""){
		$errors['etc']['Error ' . ($e->getCode())] = $e->getMessage();
	}

  echo json_encode([
    "result" => 1,
    "errors" => $errors,
  ]);
}
