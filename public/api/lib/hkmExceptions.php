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
