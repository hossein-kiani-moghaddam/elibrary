
import {useContext, useState} from "react";
import {Link} from "react-router-dom";
import {Form, FloatingLabel, Button} from "react-bootstrap";
import {UserContext} from "../context/UserContext";
import Watermark from "./Watermark";
import Brand from "./Brand";

function Login(){
	const {loginUser} = useContext(UserContext);
	const [redirect, setRedirect] = useState(false);
	const [errMsg, setErrMsg] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});

	const handleChangeInput = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmitForm = async (e) => {
		e.preventDefault();

		if(!Object.values(formData).every(val => val.trim() !== '')){
				setErrMsg('Please Fill in all Required Fields!');
				return;
		}

		const data = await loginUser(formData);
		if(data.success){
			e.target.reset();
			setRedirect("Redirecting...");
			return;
		}
		setErrMsg(data.message);
	};

	return (
		<Watermark>

			<p>&nbsp;</p>

			<div className="form-wrapper shadow-lg">
				<h2 className="text-success mb-4">LOGIN</h2>
				<Form className="login-form" onSubmit={handleSubmitForm}>

					<FloatingLabel label="Email" controlId="loginFormEmail" className="mb-3">
						<Form.Control type="text" name="email" onChange={handleChangeInput} placeholder="Email" />
					</FloatingLabel>

					<FloatingLabel label="Password" controlId="loginFormPassword" className="mb-3">
						<Form.Control type="password" name="password" onChange={handleChangeInput} placeholder="Password" />
					</FloatingLabel>

					{errMsg && <div className="err-msg text-danger mb-3">{errMsg}</div>}

					{
						redirect ?
							<div className="text-info mb-3">{redirect}</div> :
							<div className="d-grid mb-3">
								<Button type="submit" variant="success" size="lg">Submit</Button>
							</div>
					}

				</Form>

				<div className="text-center">
					<Link to="/register" style={{
						textShadow: "1px 1px 2px white"
					}}>
						Register
					</Link>
				</div>
			</div>
		</Watermark>
	);
}

export default Login;
