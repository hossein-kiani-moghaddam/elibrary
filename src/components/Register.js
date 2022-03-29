
import {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {Form, FloatingLabel, Button} from "react-bootstrap";
import {UserContext} from "../context/UserContext";
import Watermark from "./Watermark";

function Register(){
	const {user, registerUser} = useContext(UserContext);
	const [errMsg, setErrMsg] = useState(false);
	const [infoMsg, setInfoMsg] = useState(false);

	const [formData, setFormData] = useState({
		userName: "",
		email: "",
		password: "",
		retypePassword: ""
	});

	const handleChangeInput = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmitForm = async (e) => {
		e.preventDefault();

		const data = await registerUser(formData);
		// Temp:
		alert("registered");
		console.log("DATA:", data);
		////
		if(data.success){
			e.target.reset();
			setInfoMsg(data.message);
			return;
		}
		setErrMsg(data.message);
	};

	return (
		<>
			{user &&
				<Navigate to="/home" />
			}

			{!user &&
				<Watermark>

					<p>&nbsp;</p>

					<div className="form-wrapper shadow-lg">
						<h2 className="text-primary mb-4">REGISTER</h2>

						<Form className="register-form" onSubmit={handleSubmitForm}>

							<FloatingLabel label="Name" controlId="registerFormName" className="mb-3">
								<Form.Control type="text" name="userName" onChange={handleChangeInput} placeholder="Name" />
							</FloatingLabel>

							<FloatingLabel label="Email" controlId="registerFormEmail" className="mb-3">
								<Form.Control type="text" name="email" onChange={handleChangeInput} placeholder="Email" />
							</FloatingLabel>

							<FloatingLabel label="Password" controlId="registerFormPassword" className="mb-3">
								<Form.Control type="password" name="password" onChange={handleChangeInput} placeholder="Password" />
							</FloatingLabel>

							<FloatingLabel label="Retype Password" controlId="registerFormRetypePassword" className="mb-3">
								<Form.Control type="password" name="retypePassword" onChange={handleChangeInput} placeholder="Retype Password" />
							</FloatingLabel>

							{errMsg && <div className="err-msg text-danger mb-3">{errMsg}</div>}

							<div className="d-grid mb-3">
								<Button type="submit" variant="primary" size="lg">Submit</Button>
							</div>
						</Form>

						{infoMsg && <div className="info-msg text-success mb-3">{infoMsg}</div>}

					</div>
				</Watermark>
			}
		</>
	);
}

export default Register;
