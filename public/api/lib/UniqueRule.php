<?php

use Rakit\Validation\Rule;

class UniqueRule extends Rule {

  protected $message = ":attribute :value has been used";
  protected $fillableParams = ['table', 'column', 'except'];
  protected $mysqli;

  public function __construct(mysqli $mysqli) {
    $this->mysqli = $mysqli;
  }

  public function check($value): bool {
    // make sure required parameters exists
    $this->requireParameters(['table', 'column']);

    // getting parameters
    $column = $this->parameter('column');
    $table = $this->parameter('table');
    $except = $this->parameter('except');

    if ($except AND $except == $value) {
      return true;
    }

    // do query
    $stmt = $this->mysqli->prepare("
			SELECT COUNT(*) AS cnt
			FROM `{$table}`
			WHERE `{$column}` = ?
		");
    $stmt->bind_param("s", $value);
    $stmt->execute();
		$result = $stmt->get_result();
    $row = $result->fetch_assoc();

    // true for valid, false for invalid
    return intval($row['cnt']) === 0;
  }
}
