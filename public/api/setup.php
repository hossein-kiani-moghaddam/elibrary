<?php

define("APP_ID", "eLibrary");
define("APP_ROOT", str_replace("\\", "/", __DIR__));
define("API", substr(APP_ROOT, strlen($_SERVER['DOCUMENT_ROOT'])));
define("PRIVATE_DIR", $_SERVER['DOCUMENT_ROOT'] . "/../private");
define("INI_FILE", PRIVATE_DIR . "/" . strtolower(APP_ID) . ".ini");
define("LOG_FILE", PRIVATE_DIR . "/elibrary.log");
