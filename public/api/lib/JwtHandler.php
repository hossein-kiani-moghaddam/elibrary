<?php
require_once __DIR__ . "/setup.php";
require_once APP_ROOT . "/vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHandler
{
	protected $jwt_secrect;
  protected $issuedAt;
  protected $expire;

  public function __construct()
  {
    // set your default time-zone
		// Later: Fine tune this:
    date_default_timezone_set('Asia/Tehran');
    $this->issuedAt = time();

    // Token Validity (10hr)
    $this->expire = $this->issuedAt + (10 * 60 * 60);

    // Set your secret or signature
		// Later: Change the secret:
    $this->jwt_secrect = "this_is_my_secrect";
  }

  public function jwtEncodeData($iss, $data)
  {
    $token = array(
      //Adding the identifier to the token (who issue the token)
      "iss" => $iss,
      "aud" => $iss,
      // Adding the current timestamp to the token, for identifying that when the token was issued.
      "iat" => $this->issuedAt,
      // Token expiration
      "exp" => $this->expire,
      // Payload
      "data" => $data
    );

    $jwt = JWT::encode($token, $this->jwt_secrect, "HS256");
    return $jwt;
  }

  public function jwtDecodeData($jwt_token)
  {
    try {
			$key = new Key($this->jwt_secrect, "HS256");
			$decoded = JWT::decode($jwt_token, $key);

	    return [
	    	"data" => $decoded->data
	    ];
    } catch (Exception $e) {
      return [
      	"message" => $e->getMessage()
      ];
    }
  }
}
