
import {createContext, useState, useEffect} from "react";
import axios from "axios";

export const UserContext = createContext();

export const Axios = axios.create({
	baseURL: "http://localhost/elibrary/public/api/"
});

export const UserContextProvider = ({children}) => {
	let firstRender = true;
	const [theUser, setUser] = useState(null);
	const [wait, setWait] = useState(false);

	useEffect(() => {
		loggedInCheck();
	}, []);

	const registerUser = async ({userName, email, password}) => {
		setWait(true);
		try{
			const {data} = await Axios.post("register.php", {
				userName,
				email,
				password
			});

			setWait(false);
			return data;
		}
		catch(err){
			setWait(false);
			return {success: 0, message: "Server Error!"};
		}
	}

	const loginUser = async ({email, password}) => {
		const {data} = await Axios.post("login.php", {
			email,
			password
		});
		if(data.success && data.data.token){
			localStorage.setItem("loginToken", data.data.token);
			loggedInCheck();
		}
		return data;
	};

	const logoutUser = () => {
		localStorage.removeItem("loginToken");
		setUser(null);
	};

	const loggedInCheck = async () => {
		const loginToken = localStorage.getItem("loginToken");
		Axios.defaults.headers.common['Authorization'] = `Bearer ${loginToken}`;
		if(loginToken){
			const {data} = await Axios.get("getUser.php");

			if(data.success && data.user){
				const user = data.user;
				// Later:
				if(!theUser || (theUser.userName !== user.userName || theUser.email !== user.email)){
					setUser(user);
				}
			}
		}
	}

	return (
		<UserContext.Provider value={{user: theUser, registerUser, loginUser, logoutUser}}>
			{children}
		</UserContext.Provider>
	);
}
