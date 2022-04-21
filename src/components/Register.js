
import {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {Form, FloatingLabel, Button, Alert} from "react-bootstrap";
import {Formik} from "formik";
import * as Yup from "yup";
import {UserContext} from "../context/UserContext";
import Watermark from "./Watermark";

function Register(){
	const {user, registerUser} = useContext(UserContext);
	const [infoMsg, setInfoMsg] = useState(false);
	const [errMsgs, setErrMsgs] = useState(false);

	const validationSchema = Yup.object().shape({

		userName: Yup.string()
		.required("Username is required.")
	  .max(50, "Username can't be longer than 50 characters!"),

		email: Yup.string()
		.required("Email is required.")
		.email("Invalid email format!")
		.max(100, "Email can't be longer than 100 characters!"),

		password: Yup.string()
		.required("Password is required.")
		.min(6, "Password can't be smaller than 6 characters!"),

		retypePassword: Yup.string()
		.required("Retype Password is required.")
		.min(6, "Retype Password can't be smaller than 6 characters!")
    .test(
      'equal',
      'Passwords do not match!',
      function(v) { // Don't use arrow functions
        const ref = Yup.ref('password');
        return v === this.resolve(ref);
      }
    )

	});

	const submitForm = async (values, {setSubmitting, resetForm}) => {
		setSubmitting(true);

		let msg;
		try{
			const data = await registerUser(values);
			if(data.result == 0){ // Success
				setErrMsgs(false);
				setInfoMsg("You have successfully registered.");
				resetForm();
				return;
			}
			setErrMsgs(data.errors);
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
						<h2 className="text-success mb-4" style={{"textShadow": "1px 1px 1px white"}}>REGISTER</h2>

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

									<FloatingLabel label="Name" controlId="registerFormName" className="mb-3">
										<Form.Control
											name="userName"
											type="text"
											value={values.userName}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.userName && !!errors.userName }
											placeholder="Username"
										/>

										<Form.Control.Feedback type="invalid">
											{errors.userName}
										</Form.Control.Feedback>
									</FloatingLabel>

									<FloatingLabel label="Email" controlId="registerFormEmail" className="mb-3">
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

									<FloatingLabel label="Password" controlId="registerFormPassword" className="mb-3">
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

									<FloatingLabel label="Retype Password" controlId="registerFormRetypePassword" className="mb-3">
										<Form.Control
											name="retypePassword"
											type="password"
											value={values.retypePassword}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.retypePassword && !!errors.retypePassword }
											placeholder="Retype Password"
										/>

										<Form.Control.Feedback type="invalid">
											{errors.retypePassword}
										</Form.Control.Feedback>
									</FloatingLabel>

									<div className="d-grid mb-3">
										<Button type="submit" variant="success" size="lg" disabled={isSubmitting}>
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
