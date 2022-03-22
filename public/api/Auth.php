<?php
require __DIR__ . "/lib/JwtHandler.php";

class Auth extends JwtHandler{
  protected $db;
  protected $headers;
  protected $token;

  public function __construct($db, $headers){
    parent::__construct();
    $this->db = $db;
    $this->headers = $headers;
  }

  public function isValid(){
    if(array_key_exists('Authorization', $this->headers) && preg_match("/Bearer\s(\S+)/", $this->headers['Authorization'], $matches)){
      $data = $this->jwtDecodeData($matches[1]);

      if(isset($data['data']->id) && $user = $this->fetchUser($data['data']->id)){
        return [
          "success" => 1,
          "user" => $user
        ];
			}
      else{
        return [
          "success" => 0,
          "message" => $data['message'],
        ];
      }
    }
		else{
      return [
        "success" => 0,
        "message" => "Token not found in request"
      ];
    }
  }

  protected function fetchUser($userId){
    try{
      $stmt = $this->db->prepare("
				SELECT id, userName, email
				FROM Users
				WHERE id = ?
			");
      $stmt->bind_param("i", $userId);
      $stmt->execute();
			$result = $stmt->get_result();

			if($row = $result->fetch_assoc()){
				return $row;
			}
			else{
				return false;
			}
    }
		catch(mysqli_sql_exception $se){
      return null;
    }
  }
}
