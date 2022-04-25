
import {createContext, useState, useEffect} from "react";
import axios from "axios";
import {API} from "../Constants";

export const UserContext = createContext();

export const Axios = axios.create({
	baseURL: API + "/"
});

export const UserContextProvider = ({children}) => {
	const [theUser, setUser] = useState(null);

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

	useEffect(() => {
		loggedInCheck();
	}, []);

	const registerUser = async ({userName, email, password, retypePassword}) => {
		try{
			let formData = new FormData();
			formData.append("userName", userName);
			formData.append("email", email);
			formData.append("password", password);
			formData.append("retypePassword", retypePassword);

			const {data} = await Axios.post("register.php", formData, {
				headers: {
					"Content-Type": "x-www-form-urlencoded"
				}
			});

			return data;
		}
		catch(err){
			return {success: 0, message: "Server Error!"};
		}
	}

	const loginUser = async ({email, password}) => {
		let formData = new FormData();
		formData.append("email", email);
		formData.append("password", password);

		const {data} = await Axios.post("login.php", formData, {
			headers: {
				"Content-Type": "x-www-form-urlencoded"
			}
		});

		if(data.result === 0 && data.data.token){
			localStorage.setItem("loginToken", data.data.token);
			loggedInCheck();
		}
		return data;
	};

	const logoutUser = () => {
		localStorage.removeItem("loginToken");
		setUser(null);
	};

	return (
		<UserContext.Provider value={{user: theUser, registerUser, loginUser, logoutUser}}>
			{children}
		</UserContext.Provider>
	);
}
