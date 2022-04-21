<?php

require_once __DIR__ . "/UniqueRule.php";

use Rakit\Validation\Validator;

function rakitValidator($mysqli) {
	$validator = new Validator();
	$validator->addValidator("unique", new UniqueRule($mysqli));
	return $validator;
}
