<?php

class HkmFileNotFoundException extends Exception{
	public function __construct($message, $code = 0, Throwable $previous = null){
		parent::__construct($message, $code, $previous);
	}
}


class HkmInvalidValueException extends Exception{
	public function __construct($message, $code = 0, Throwable $previous = null){
		parent::__construct($message, $code, $previous);
	}
}

class HkmResponseException extends Exception{
	private $result;
	private $errors;

	public function __construct($result, $errors = [], Throwable $previous = null){
		parent::__construct("", 0, $previous);
		$this->result = $result;
		$this->errors = $errors;
	}

	public function getResult(){
		return $this->result;
	}

	public function getErrors(){
		return $this->errors;
	}

	public function getResponse(){
		return [
			"result" => $this->result,
			"errors" => $this->errors,
		];
	}
}
