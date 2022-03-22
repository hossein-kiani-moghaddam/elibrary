<?php
require_once __DIR__ . "/mysqlx.php";

function connectDb($iniFile){
	$defaults = [
		"hostname" => ini_get("mysqli.default_host"),
		"username" => ini_get("mysqli.default_user"),
		"password" => ini_get("mysqli.default_pw"),
		"database" => "",
		"port" => ini_get("mysqli.default_port"),
		"socket" => ini_get("mysqli.default_socket")
	];

	$config = parse_ini_file($iniFile, true);
	if($config === false){
		throw new Exception("Error in reading private file.");
	}
	$connection = array_merge($defaults, $config['connection']);
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	$mysqli = new mysqlx($connection['hostname'], $connection['username'], $connection['password'], $connection['database'], $connection['port'], $connection['socket']);
	$mysqli->set_charset("utf8");
	return $mysqli;
}

function execQuery($mysqli, $query){
  $query = trim($query);
  $query = rtrim($query, ";");
  $command = strtoupper(substr($query, 0, 6));

  // Log SQL command:
  // if(LOG_SQL){
  //   if($command != "SELECT" || SQL_LOG_SELECT)
  //     hkmlog($query);
  // }

  $result = $mysqli->query($query);
  if($result === false){
    throw new Exception(mysqli_error($mysqli) . "  " . $query);
  }

  if($command == "INSERT"){
    return $mysqli->insert_id;
	}
  else if($command == "SELECT"){
    return $result;
	}
  else{
    return $mysqli->affected_rows;
	}
}

function execScript($mysqli, $script, $separator = ";"){
  $queries = explode($separator, trim($script));
  foreach($queries as $query){
    $query = trim($query);
    if($query != "")
      $result = exec_query($mysqli, $query);
  }
  return $result;
}

// $cntPerPage = 0 means no pagination
function selectFrom($mysqli, $query, $pageNo = 1, $cntPerPage = 0){
  if($cntPerPage > 0){
    $offset = ($pageNo - 1) * $cntPerPage;
    if($offset < 0){
			$offset = 0;
		}
    $query .= "
      LIMIT $cntPerPage
      OFFSET $offset
    ";
  }

	return execQuery($mysqli, $query);
}

function insertIntoTable($mysqli, $tblName, Array $data){
  $sep = "";
  $fields = "";
  $values = "";
  foreach($data as $field => $value){
		if($value !== NULL){
			if(is_bool($value)){
				$value = ($value ? 1 : 0);
			}
			$fields .= "$sep $field";
			$values .= "$sep '$value'";
			$sep = ",";
		}
  }

  return execQuery($mysqli, "
		INSERT INTO $tblName
		($fields) VALUES ($values)
  ");
}

// $id: as field/value pairs
function updateTable($mysqli, $tblName, Array $id, Array $data){
  $setText = "";
  $sep = "";
  foreach($data as $field => $value){
		if(is_bool($value))
			$value = ($value ? 1 : 0);
		$setText .= "$sep $field = " . ($value === NULL ? "NULL" : "'$value'");
		$sep = ",";
  }

  $whereText = "";
  $sep = "";
  foreach($id as $field => $value){
		if(is_bool($value))
			$value = ($value ? 1 : 0);
		$whereText .= "$sep $field = '$value' ";
		$sep = "AND ";
  }

  return execQuery($mysqli, "
		UPDATE $tblName
		SET $setText
		WHERE $whereText
  ");
}

function deleteFromTable($mysqli, $tblName, $filter){
  $whereText = "";
  if(is_assoc($filter)){
		foreach($filter as $field => $value){
			if(!empty($whereText))
				$whereText .= " AND ";
			if(is_bool($value))
				$value = ($value ? 1 : 0);
			$whereText .= "$field = '$value'";
		}
  }
  elseif(is_string($filter)){
		$whereText = $filter;
  }

  $whereExpr = (empty($whereText) ? "" : "WHERE $whereText");
  execQuery($mysqli, "
		DELETE FROM $tblName
		$whereExpr
  ");
}
