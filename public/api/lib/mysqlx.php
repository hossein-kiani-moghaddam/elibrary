<?php

class mysqlx extends mysqli{
	private $in_trans;

	// override
	public function begin_transaction($flags = NULL, $name = null){
		if($this->in_trans){
			throw new mysqli_sql_exception("Error! Already in transaction");
		}
		if(isset($name)){
			$this->in_trans = parent::begin_transaction($flags, $name);
		}
		else{
			$this->in_trans = parent::begin_transaction($flags);
		}
		return $this->in_trans;
	}

	public function commit($flags = NULL, $name = null){
		if(isset($name)){
			$ret = parent::commit($flags, $name);
		}
		else{
			$ret = parent::commit($flags);
		}
		if($ret){
			$this->in_trans = false;
		}
		return $ret;
	}

	public function rollback($flags = NULL, $name = null){
		if(isset($name)){
			$ret = parent::rollback($flags, $name);
		}
		else{
			$ret = parent::rollback($flags);
		}
		if($ret){
			$this->in_trans = false;
		}
		return $ret;
	}

	public function in_transaction(){
		return $this->in_trans;
	}
}
