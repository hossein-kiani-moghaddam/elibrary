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
require_once "Auth.php";

require_once "lib/log.php";
$logger = new Logger(LOG_FILE);
$logger->log("_____ start logging saveBook");

try{

  if($_SERVER['REQUEST_METHOD'] != "POST"){
    throw new HkmResponseException(1, [
			"etc" => [
				"etc1" => "Page not found!"
			],
		]);
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

  $validator = rakitValidator(eldb());

  $validation = $validator->make($_POST + $_FILES, [
    "fileName" => "required|uploaded_file:0,20M,pdf,txt,epub,html,doc,docx",
    "thumbnail" => "uploaded_file:0,500K,png,bmp,jpg,jpeg,gif,svg",
    "title" => "required|max:100",
    "publication" => "max:50",
    "authors" => "max:80",
    "pagesCount" => "required|integer|min:1",
    "pubYear" => "required|integer|min:1000|max:9999",
  ]);

  $validation->validate();

  if($validation->fails()){
    throw new HkmResponseException(1, $validation->errors()->toArray());
  }

  $data = arrayOnly($_POST, ["title", "publication", "authors", "pagesCount", "pubYear"]);

  try{
    eldb()->begin_transaction();
  	$data['id'] = insertIntoTable(eldb(), "Books", $data);

    // Prepare book file:
    $booksDir = APP_ROOT . "/../books";

    $ext = strtolower(pathinfo($_FILES['fileName']['name'], PATHINFO_EXTENSION));
    $tmpFileName = $_FILES['fileName']['tmp_name'];
    $bookFileName = strtolower("$data[id].$ext");

    forceDir($booksDir);
    if(move_uploaded_file($tmpFileName, $booksDir . "/" . $bookFileName)){
      $data['fileName'] = $bookFileName;
    }
    else{
      throw new Exception("Error in uploading fileName.");
    }

    updateTable(eldb(), "Books", arrayOnly($data, ["id"]), arrayOnly($data, ["fileName"]));

  	// Prepare thumbnail file:
    $thumbnailsDir = APP_ROOT . "/../thumbnails";

    if(!empty($_FILES['thumbnail']['name'])){
      $ext = strtolower(pathinfo($_FILES['thumbnail']['name'], PATHINFO_EXTENSION));
      $tmpFileName = $_FILES['thumbnail']['tmp_name'];
      $thumbFileName = strtolower("$data[id].$ext");

      forceDir($thumbnailsDir);
      if(move_uploaded_file($tmpFileName, $thumbnailsDir . "/" . $thumbFileName)){
        $data['thumbnail'] = $thumbFileName;
      }
      else{
        throw new Exception("Error in uploading thumbnail.");
      }

  		updateTable(eldb(), "Books", arrayOnly($data, ["id"]), arrayOnly($data, ["thumbnail"]));
    }
    eldb()->commit();
  }
  catch(mysqli_sql_exception $se){
    eldb()->rollback();
    throw new HkmResponseException(1, [
      "etc" => [
        "etc1" => "SQL Error!"
      ]
    ]);
  }

	echo json_encode([
		"result" => 0,
    "data" => $data,
	]);
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
