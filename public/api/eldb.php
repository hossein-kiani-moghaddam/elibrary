<?php

require_once __DIR__ . "/setup.php";
require_once APP_ROOT . "/lib/db.php";

function eldb(){
	static $mysqli = NULL;

	// Only once connect to db:
	if(!$mysqli){
		$mysqli = connectDb(INI_FILE);
	}

	// Later return the same connection:
	return $mysqli;
}

function booksList($mysqli, $userId, $favoritesOnly = false){
	$books = [];
	$query = "SELECT Books.*,
		(
			SELECT COUNT(*)
			FROM Favorites
			WHERE Favorites.userId = ?
				AND Favorites.bookId = Books.id
		) AS isFavorite
		FROM Books
	";
	if($favoritesOnly){
		$query .= "
			INNER JOIN Favorites
				ON Favorites.userId = ?
				AND Books.id = Favorites.bookId
		";
	}
	$stmt = $mysqli->prepare($query);
	if($favoritesOnly){
		$stmt->bind_param("ii", $userId, $userId);
	}
	else{
		$stmt->bind_param("i", $userId);
	}
	$stmt->execute();
	$result = $stmt->get_result();

	while($row = $result->fetch_assoc()){
		$books[] = $row;
	}
	return $books;
}
