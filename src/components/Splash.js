
import {useContext, useEffect} from "react";
import {Navigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";

function Splash() {
	const {user} = useContext(UserContext);

	if(user){
		return (
			<Navigate to="/home" replace />
		);
	}
	else{
		return (
			<Navigate to="/login" replace />
		);
	}
	// return (
	// 	<div>
	// 		Welcome to eLibrary.<br />
	// 		Please wait a moment ...
	// 	</div>
	// );
}

export default Splash;
