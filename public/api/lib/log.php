<?php

class Logger{
  private $filename;
  private $fp;

  public function __construct($t_filename){
    if(empty($t_filename) || !is_string($t_filename)){
      throw new Exception("Invalid parameter in Logger::__construct().");
    }
    $this->fp = NULL;
    $this->open($t_filename);
  }

  public function __destruct(){
    $this->close();
  }

  private function open($t_filename = NULL){
    if($t_filename !== NULL){
      if($this->isOpen()){
        $this->close();
      }
      $this->filename = $t_filename;
    }

    $l_dirname = dirname($this->filename);
    if(!is_dir($l_dirname)){
      if(!@mkdir($l_dirname, 0777, true))
        throw new Exception("HKM Error: Can't create directory: [$l_dirname]");
    }

    if(is_file($this->filename)){
      $l_fp = fopen($this->filename, "a");
    }
    else{
      $l_fp = fopen($this->filename, "w");
    }
    // Failure:
    if($l_fp === false){
      throw new Exception("Cannot open log file: $this->filename");
    }
    $this->fp = $l_fp;
  }

  private function isOpen(){
    return ($this->fp !== NULL);
  }

  private function close(){
    if($this->isOpen()){
      fclose($this->fp);
      $this->fp = NULL;
    }
  }

  public function log($t_message){
    if(is_array($t_message)){
				$t_message = serialize($t_message);
			}
    fwrite($this->fp, $t_message . PHP_EOL);
  }

  public function clear(){
    ftruncate($this->fp, 0);
  }
}
