<?php

define("APP_ID", "eLibrary");
define("APP_ROOT", str_replace("\\", "/", __DIR__));
define("API", "http://localhost/elibrary/public/api");
define("PRIVATE_DIR", $_SERVER['DOCUMENT_ROOT'] . "/../private");
define("INI_FILE", PRIVATE_DIR . "/" . strtolower(APP_ID) . ".ini");
