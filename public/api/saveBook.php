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
$logger->log("_____ start logging saveBook");

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
	$data['title'] = validateInput(INPUT_POST, "title", "string", $errors['save']);
	$data['publication'] = validateInput(INPUT_POST, "publication", "string", $errors['save'], ["optional" => true]);
	$data['authors'] = validateInput(INPUT_POST, "authors", "string", $errors['save'], ["optional" => true]);
	$data['pagesCount'] = validateInput(INPUT_POST, "pagesCount", "int", $errors['save'], ["min_range" => 1]);
	$data['pubYear'] = validateInput(INPUT_POST, "pubYear", "int", $errors['save'], ["min_range" => 1000, "max_range" => 9999]);

	if(hasError($errors)){
		throw new Exception();
	}

  eldb()->begin_transaction();
	$data['id'] = insertIntoTable(eldb(), "Books", $data);

  // Prepare book file:
  $validExtensions = ["pdf", "txt", "epub", "html", "doc", "docx"];
  $booksDir = APP_ROOT . "/../books";

  if(!empty($_FILES['fileName']['name'])){
    $ext = strtolower(pathinfo($_FILES['fileName']['name'], PATHINFO_EXTENSION));
    $tmpFileName = $_FILES['fileName']['tmp_name'];
    $bookFileName = strtolower("$data[id].$ext");

    // check valid format:
    if(!in_array($ext, $validExtensions)){
      throw new Exception("Invalid file format. (Allowable formats: " . implode(", ", $validExtensions) . ")");
    }
    else{
			forceDir($booksDir);
      if(move_uploaded_file($tmpFileName, $booksDir . "/" . $bookFileName)){
        $data['fileName'] = $bookFileName;
      }
      else{
        throw new Exception("Error in uploading fileName.");
      }
    }

		updateTable(eldb(), "Books", arrayOnly($data, ["id"]), arrayOnly($data, ["fileName"]));
  }
  else{
    $errors['save']['fileName'] = "notset";
    throw new Exception();
  }

	// Prepare thumbnail file:
  $validExtensions = ["png", "bmp", "jpg", "jpeg", "gif", "svg"];
  $thumbnailsDir = APP_ROOT . "/../thumbnails";

  if(!empty($_FILES['thumbnail']['name'])){
    $ext = strtolower(pathinfo($_FILES['thumbnail']['name'], PATHINFO_EXTENSION));
    $tmpFileName = $_FILES['thumbnail']['tmp_name'];
    $thumbFileName = strtolower("$data[id].$ext");

    // check valid format:
    if(!in_array($ext, $validExtensions)){
      throw new Exception("Invalid file format. (Allowable formats: " . implode(", ", $validExtensions) . ")");
    }
    else{
			forceDir($thumbnailsDir);
      if(move_uploaded_file($tmpFileName, $thumbnailsDir . "/" . $thumbFileName)){
        $data['thumbnail'] = $thumbFileName;
      }
      else{
        throw new Exception("Error in uploading thumbnail.");
      }
    }

		updateTable(eldb(), "Books", arrayOnly($data, ["id"]), arrayOnly($data, ["thumbnail"]));
  }
  eldb()->commit();

	echo json_encode([
		"result" => 0,
		"books" => booksList(eldb(), $userId)
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
