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
$logger->log("_____ start logging books");

$errors = [
	"etc" => []
];

$userId = NULL;
$allHeaders = getallheaders();
$auth = new Auth(eldb(), $allHeaders);
$valid = $auth->isValid();
if($valid['success']){
	$userId = $valid['user']['id'];
}

$favoritesOnly = validateInput(INPUT_GET, "favoritesOnly", "bool", $errors['etc'], ["optional" => true, "default" => false]);

// if(hasError($errors)){
// 	throw exception();
// }

echo json_encode([
	"result" => 0,
	"books" => booksList(eldb(), $userId, $favoritesOnly)
]);
