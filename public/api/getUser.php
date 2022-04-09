<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "eldb.php";
require_once "Auth.php";

require_once "setup.php";
require_once "lib/log.php";
$logger = new Logger(LOG_FILE);
$logger->log("_____ start logging getUser");

$allHeaders = getallheaders();
$auth = new Auth(eldb(), $allHeaders);
echo json_encode($auth->isValid());
