
import {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {Form, FloatingLabel, Button, Alert} from "react-bootstrap";
import {Formik} from "formik";
import * as Yup from "yup";
import {UserContext} from "../context/UserContext";
import Watermark from "./Watermark";

function Login(){
	const {user, loginUser} = useContext(UserContext);
	const [redirect, setRedirect] = useState(false);
	const [infoMsg, setInfoMsg] = useState(false);
	const [errMsgs, setErrMsgs] = useState(false);

	const validationSchema = Yup.object().shape({

		email: Yup.string()
		.required("Email is required.")
		.email("Invalid email format!")
		.max(100, "Email can't be longer than 100 characters!"),

		password: Yup.string()
		.required("Password is required.")
		.min(6, "Password can't be smaller than 6 characters!"),

	});

	const submitForm = async (values, {setSubmitting, resetForm}) => {
		setSubmitting(true);

		let msg;
		try{
			const data = await loginUser(values);
			if(data.result == 0){ // Success
				setErrMsgs(false);
				setInfoMsg("You have successfully logged in.")
				resetForm();
			}
			else{
				setErrMsgs(data.errors);
			}
		}
		catch(e){
			// Later:
			// msg = e.message;
		}

		setInfoMsg(false);
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
						<h2 className="text-success mb-4" style={{"textShadow": "1px 1px 1px white"}}>LOGIN</h2>

						<Formik
			        initialValues={{
								email: "",
								password: ""
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
								<Form noValidate onSubmit={handleSubmit}>

									{infoMsg &&
										<Alert variant="success">
											{infoMsg}
										</Alert>
									}
									{errMsgs &&
										<Alert variant="danger">
											<h5>Errors:</h5>
											<ul>
												{
													Object.entries(errMsgs).map(([errKey,errValue],i) => {
														return Object.entries(errValue).map(([key,value],j) => <li key={j}>{value}</li>)
													})
												}
											</ul>
										</Alert>
									}

									<FloatingLabel label="Email" controlId="loginFormEmail" className="mb-3">
										<Form.Control
											name="email"
											type="email"
											value={values.email}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.email && !!errors.email }
											placeholder="Email"
										/>

										<Form.Control.Feedback type="invalid">
											{errors.email}
										</Form.Control.Feedback>
									</FloatingLabel>

									<FloatingLabel label="Password" controlId="loginFormPassword" className="mb-3">
										<Form.Control
											name="password"
											type="password"
											value={values.password}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.password && !!errors.password }
											placeholder="Password"
										/>

										<Form.Control.Feedback type="invalid">
											{errors.password}
										</Form.Control.Feedback>
									</FloatingLabel>

									{
										redirect ?
											<Alert variant="info">{redirect}</Alert> :

											<div className="d-grid mb-3">
												<Button type="submit" variant="success" size="lg" disabled={isSubmitting}>
													{isSubmitting ? "Sending..." : "Submit"}
												</Button>
											</div>
									}

								</Form>
				      )}
			      </Formik>

					</div>
				</Watermark>
			}
		</>
	);
}

export default Login;
