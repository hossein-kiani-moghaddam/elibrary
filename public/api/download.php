<?php
header("Access-Control-Allow-Origin: *");

require_once "lib/validate.php";
require_once "eldb.php";
require_once "lib/hkmExceptions.php";

require_once "setup.php";
require_once "lib/log.php";
$logger = new Logger(LOG_FILE);
$logger->log("_____ start logging download");

try{
	$errors = [
		"etc" => []
	];
	$bookId = validateInput(INPUT_GET, "bookId", "int", $errors['etc'], ["min_range" => 1]);
	if(hasError($errors)){
		throw new HkmInvalidValueException();
	}

	// Fetch title of book:
	$stmt = eldb()->prepare("
		SELECT title, fileName, thumbnail
		FROM Books
		WHERE id = ?
	");
	$stmt->bind_param("i", $bookId);
	$stmt->execute();
	$result = $stmt->get_result();
	$book = $result->fetch_assoc();
	if(!$book){
		throw new HkmFileNotFoundException("Book not found!");
	}

	//The relative path to book file.
	$bookFile = "../books/$book[fileName]";
	if(!file_exists($bookFile)){
		throw new HkmFileNotFoundException("Book not found!");
	}

	//Set the Content-Type to application/pdf
	header('Content-Type: application/octet-stream');

	//Set the Content-Length header.
	header('Content-Length: ' . filesize($bookFile));

	//Set the Content-Transfer-Encoding to "Binary"
	header('Content-Transfer-Encoding: Binary');

	// The filename that it should download as.
	$ext = pathinfo($book['fileName'], PATHINFO_EXTENSION);
	$downloadName = "$book[title].$ext";

	// Set the Content-Disposition to attachment and specify
	// the name of the file.
	header('Access-Control-Expose-Headers: Content-Disposition');
	header('Content-Disposition: attachment; filename=' . $downloadName);

	//Read the PDF file data and exit the script.
	readfile($bookFile);
	exit;
}
catch(HkmInvalidValueException $ie){
	// Send 400 response (Bad Request).
	http_response_code(400);
	//Kill the script.
	exit;
}
catch(HkmFileNotFoundException $ne){
	// Send 404 response (Not Found).
	http_response_code(404);
	//Kill the script.
	exit;
}
catch(Exception $e){
	// Send 500 response (Server Error).
	http_response_code(500);
	//Kill the script.
	exit;
}
