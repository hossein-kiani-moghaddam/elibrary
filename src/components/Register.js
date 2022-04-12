
import {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {Form, FloatingLabel, Button, Alert} from "react-bootstrap";
import {Formik} from "formik";
import * as Yup from "yup";
import {UserContext} from "../context/UserContext";
import Watermark from "./Watermark";

function Register(){
	const {user, registerUser} = useContext(UserContext);
	const [errMsg, setErrMsg] = useState(false);
	const [infoMsg, setInfoMsg] = useState(false);

	const validationSchema = Yup.object().shape({

		userName: Yup.string()
		.required("Username is required")
	  .max(50, "Username can't be longer than 50 characters!"),

		email: Yup.string()
		.required("Email is required")
		.max(100, "Email can't be longer than 100 characters!"),

		password: Yup.string()
		.required("Password is required")
		.min(6, "Password can't be smaller than 6 characters!"),

		retypePassword: Yup.string()
		.required("Retype Password is required")
		.min(6, "Retype Password can't be smaller than 6 characters!"),

	});

	const submitForm = async (values, {setSubmitting, resetForm}) => {
		setSubmitting(true);

		let msg;
		try{
			const data = await registerUser(values);
			if(data.success){
				setErrMsg(false);
				setInfoMsg(data.message);
				resetForm();
				return;
			}
			msg = data.message;
		}
		catch(e){
			msg = e.message;
		}

		setInfoMsg(false);
		setErrMsg(msg);

		setSubmitting(false);
	};

	return (
		<>
			{user &&
				<Navigate to="/home" />
			}

			{!user &&
				<Watermark>

					<div>&nbsp;</div>

					<div className="form-wrapper shadow-lg">
						<h2 className="text-primary mb-4" style={{"textShadow": "1px 1px 1px white"}}>REGISTER</h2>

						<Formik
			        initialValues={{
								userName: "",
								email: "",
								password: "",
								retypePassword: ""
							}}
			        validationSchema={validationSchema}
			        onSubmit={submitForm}
			      >
			        {/* Callback function containing Formik state and helpers that handle common form actions */}
				      {( {values,
				          errors,
				          touched,
									setFieldValue,
				          handleChange,
				          handleBlur,
				          handleSubmit,
									handleReset,
				          isSubmitting} ) => (
								<Form onSubmit={handleSubmit}>

									{infoMsg &&
										<Alert variant="success">
											{infoMsg}
										</Alert>
									}
									{errMsg &&
										<Alert variant="danger">
											{errMsg}
										</Alert>
									}

									<FloatingLabel label="Name" controlId="registerFormName" className="mb-3">
										<Form.Control
											name="userName"
											type="text"
											value={values.userName}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.userName && !!errors.userName }
											placeholder="Username" />
									</FloatingLabel>
									<Form.Control.Feedback type="invalid">
										{errors.userName}
									</Form.Control.Feedback>

									<FloatingLabel label="Email" controlId="registerFormEmail" className="mb-3">
										<Form.Control
											name="email"
											type="email"
											value={values.email}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.email && !!errors.email }
											placeholder="Email" />
									</FloatingLabel>
									<Form.Control.Feedback type="invalid">
										{errors.email}
									</Form.Control.Feedback>

									<FloatingLabel label="Password" controlId="registerFormPassword" className="mb-3">
										<Form.Control
											name="password"
											type="password"
											value={values.password}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.password && !!errors.password }
											placeholder="Password" />
									</FloatingLabel>
									<Form.Control.Feedback type="invalid">
										{errors.password}
									</Form.Control.Feedback>

									<FloatingLabel label="Retype Password" controlId="registerFormRetypePassword" className="mb-3">
										<Form.Control
											name="retypePassword"
											type="password"
											value={values.retypePassword}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.retypePassword && !!errors.retypePassword }
											placeholder="Retype Password" />
									</FloatingLabel>
									<Form.Control.Feedback type="invalid">
										{errors.retypePassword}
									</Form.Control.Feedback>

									<div className="d-grid mb-3">
										<Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
											{isSubmitting ? "Sending..." : "Submit"}
										</Button>
									</div>

								</Form>
				      )}
			      </Formik>

					</div>
				</Watermark>
			}
		</>
	);
}

export default Register;
