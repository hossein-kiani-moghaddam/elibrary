<?php

// $filter:
//   array
//   string
//   int
//   float
//   bool
//   email
//   sh_date
//   time
//
// $settings:
//   optional (false)
//   default (NULL)
//   min_range
//   max_range
function validate($key, $val, $filter, &$errors, $settings = []){
  if($filter != "array" && isset($val)){
    $val = htmlspecialchars(stripslashes(trim($val)));
  }

  // optional:
  if(array_key_exists("optional", $settings)){
    $optional = $settings['optional'];
  }
  else{
    $optional = false;
  }

  // default:
  if(array_key_exists("default", $settings)){
    $default = $settings['default'];
  }
  else{
    $default = NULL;
  }

  // options:
  $options = [];
  if(array_key_exists("min_range", $settings)){
    $options['min_range'] = $settings['min_range'];
  }
  if(array_key_exists("max_range", $settings)){
    $options['max_range'] = $settings['max_range'];
  }

  if(!isset($val) || $val === ""){
    $value = NULL;
  }
  else{
    if($filter == "array"){
      if(!is_array($val)){
        $value = false;
      }
      else{
        $value = $val;
      }
    }
    elseif($filter == "string"){
      $value = filter_var($val, FILTER_SANITIZE_STRING, $options);
    }
    elseif($filter == "int"){
      $value = filter_var($val, FILTER_VALIDATE_INT, $options);
    }
    elseif($filter == "float"){
      $value = filter_var($val, FILTER_VALIDATE_FLOAT, $options);
    }
    elseif($filter == "bool"){
      $value = filter_var($val, FILTER_VALIDATE_BOOLEAN, $options);
    }
    elseif($filter == "email"){
      $var = filter_var($val, FILTER_SANITIZE_EMAIL);
      if($var){
        $value = filter_var($var, FILTER_VALIDATE_EMAIL);
      }
      else{
        $value = NULL;
      }
    }
    // elseif($filter == "sh_date"){
    //   $var = validateVal($val, "string", $errors, $settings);
    //   if($var){
    //     if(jdate_is_valid($var))
    //       $value = $var;
    //     else
    //       $value = false;
    //   }
    //   else
    //     $value = NULL;
    // }
    // elseif($filter == "time"){
    //   $var = validateArray($arr, $key, "string", $errors, $settings);
    //   if($var){
    //     if(time_is_valid($var))
    //       $value = $var;
    //     else
    //       $value = false;
    //   }
    //   else
    //     $value = NULL;
    // }
    else{
      throw new Exception("Invalid filter in validateArray()");
    }
  }

  if($value === false && $filter != "bool"){ // invalid
    $errors[$key] = "invalid";
  }
  elseif($value === NULL || $value === ""){
    if(!$optional){
      $errors[$key] = "notset";
    }
    else{
      $value = $default;
    }
  }

  return $value;
}

function validateArray($arr, $key, $filter, &$errors, $settings = []){
  $val = (array_key_exists($key, $arr) ? $arr[$key] : NULL);
  return validate($key, $val, $filter, $errors, $settings);
}

function validateInput($type, $key, $filter, &$errors, $settings = []){
  if($type == INPUT_GET){
    return validateArray($_GET, $key, $filter, $errors, $settings);
	}
  else if($type == INPUT_POST){
    return validateArray($_POST, $key, $filter, $errors, $settings);
	}
  else{
    throw new Exception("Invalid parameter 1 in validateInput()");
	}
}

function hasError($errors){
  foreach($errors as $category => $catErrors){
    if(count($catErrors) > 0)
      return true;
  }
  return false;
}
