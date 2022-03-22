<?php

function forceDir($path){
  if(!is_dir($path)){
  if(!@mkdir($path, 0777, true)){
			throw new Exception("Can't create directory: [$path]");
		}
  }
}

function arrayOnly(Array $assoc, Array $keys){
   $newAr = [];
   foreach($keys as $key)
    $newAr[$key] = $assoc[$key];
   return $newAr;
}

function arrayExcept(Array $assoc, Array $keys){
   $newAr = [];
   foreach($assoc as $key => $value){
    if(!in_array($key, $keys))
     $newAr[$key] = $value;
   }
   return $newAr;
}

function response($success, $status, $message, $extra = []){
  return array_merge([
    "success" => $success,
    "status" => $status,
    "message" => $message
  ], $extra);
}
