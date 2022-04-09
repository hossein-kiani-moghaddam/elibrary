<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "lib/validate.php";
require_once "eldb.php";
require_once "Auth.php";

require_once "setup.php";
require_once "lib/log.php";
$logger = new Logger(LOG_FILE);
$logger->log("_____ start logging getBook");

try{
	$errors = [
		"etc" => [],
	];

	$userId = NULL;
	$allHeaders = getallheaders();
	$auth = new Auth(eldb(), $allHeaders);
	$valid = $auth->isValid();
	if($valid['success']){
		$userId = $valid['user']['id'];
	}

	$bookId = validateInput(INPUT_GET, "bookId", "int", $errors['etc'], ["min_range" => 1]);

	$stmt = eldb()->prepare("
		SELECT Books.*,
			(
				SELECT COUNT(*)
				FROM Favorites
				WHERE Favorites.userId = ?
					AND Favorites.bookId = Books.id
			) AS isFavorite
		FROM Books
		WHERE id = ?
	");
	$stmt->bind_param("ii", $userId, $bookId);
	$stmt->execute();
	$result = $stmt->get_result();
	$book = $result->fetch_assoc();
	if(!$book){
		throw new Exception("Book with id=$bookId not found!");
	}

	echo json_encode([
		"result" => 0,
		"book" => $book
	]);
}
catch(Exception $e){
	if($e->getMessage() !== ""){
		$errors['etc']['Error ' . ($e->getCode())] = $e->getMessage();
	}

  echo json_encode([
    "result" => 1,
    "errors" => $errors,
  ]);
}
