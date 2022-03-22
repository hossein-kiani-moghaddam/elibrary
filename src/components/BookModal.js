
import {useState} from "react";
import {Modal, Form, Row, Col, Button} from "react-bootstrap";
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {Axios} from "../context/UserContext";

function BookModal({show, afterSave, onHide}){
	const errors = {};
	const BOOKFILE_SIZE = 20 * 1024 * 1024;
	const THUMBNAIL_SIZE = 2 * 1024 * 1024;
	const BOOKFILE_FORMATS = ["application/pdf", "text/plain", "application/epub+zip", "text/html", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
	const THUMBNAIL_FORMATS = ["image/png", "image/bmp", "image/jpeg", "image/gif", "image/svg+xml"];

	const validationSchema = Yup.object().shape({

		fileName: Yup.mixed()
		.required("File name is required!")
		.test("FILE_SIZE", "File Size is too large!", value => value && value.size <= BOOKFILE_SIZE)
		.test("FILE_FORMAT", "Only supports: pdf, txt, epub, html, doc, docx", value => value && BOOKFILE_FORMATS.includes(value.type)),

		thumbnail: Yup.mixed()
		.test("FILE_SIZE", "Cover image is too large!", value => !value || value.size <= THUMBNAIL_SIZE)
		.test("FILE_FORMAT", "Only supports: png, bmp, jpg, jpeg, gif, svg", value => !value || THUMBNAIL_FORMATS.includes(value.type)),

		title: Yup.string()
		.required("Title is required")
	  .max(100, "Title can't be longer than 100 characters!"),

		publication: Yup.string()
		.max(50, "Publication can't be longer than 50 characters!"),

		authors: Yup.string()
		.max(80, "Authors can't be longer than 80 characters!"),

		pagesCount: Yup.number()
		.required("Pages count is required!")
		.min(1, "Pages count should be greater or equal to 1"),

		pubYear: Yup.number()
		.required("Publication year is required!")
		.min(1000, "Publication year should be between 1000 - 9999")
		.max(9999, "Publication year should be between 1000 - 9999"),
	});

	const submitForm = async (values, {setSubmitting}) => {
		setSubmitting(true);
		const formData = new FormData();
		for(const key in values){
			formData.append(key, values[key]);
		}

		try{
			const {data} = await Axios.post("saveBook.php", formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});
			if(data.result === 0){
				afterSave(data.books);
			}
			else{ // Invalid data:
				// Later: ...
				console.log("invalid data");
			}
		}
		catch(e){
			console.log("error in saving book!", e);
		}
		setSubmitting(false);
	};

	return (
		<>
      <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} scrollable={true}>
        <Modal.Header className="text-white bg-primary" closeButton closeVariant="white">
          <Modal.Title>New eBook</Modal.Title>
        </Modal.Header>

        <Modal.Body>
					<Formik
		        initialValues={{
							fileName: "",
							thumbnail: "",
							title: "",
							publication: "",
							authors: "",
							pagesCount: 1,
							pubYear: ""
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
			          isSubmitting }) => (
							<Form onSubmit={handleSubmit}>

								<Form.Group as={Col} controlId="bookModalFileName" className="mb-3">
							    <Form.Label>File Name</Form.Label>
							    <Form.Control
										name="fileName"
										type="file"
										onChange={(e) => {
											setFieldValue("fileName", e.currentTarget.files[0]);
										}}
										onBlur={handleBlur}
										isInvalid={ !!touched.fileName && !!errors.fileName }
									/>
									<Form.Control.Feedback type='invalid'>
										{ errors.fileName }
									</Form.Control.Feedback>
							  </Form.Group>

								<Form.Group controlId="bookModalThumbnail" className="mb-3">
							    <Form.Label>Cover</Form.Label>
							    <Form.Control
										name="thumbnail"
										type="file"
										onChange={(e) => {
											setFieldValue("thumbnail", e.currentTarget.files[0]);
										}}
										onBlur={handleBlur}
										isInvalid={ !!touched.thumbnail && !!errors.thumbnail }
									/>
									<Form.Control.Feedback type='invalid'>
										{ errors.thumbnail }
									</Form.Control.Feedback>
							  </Form.Group>

								<Form.Group as={Col} controlId="bookModalTitle" className="mb-3">
									<Form.Label>Title</Form.Label>
									<Form.Control
										name="title"
										type="text"
										value={values.title}
										onChange={handleChange}
										onBlur={handleBlur}
										isInvalid={ !!touched.title && !!errors.title }
									/>
									<Form.Control.Feedback type='invalid'>
										{errors.title}
									</Form.Control.Feedback>
								</Form.Group>

								<Row className="mb-3">
									<Form.Group as={Col} controlId="bookModalPublication">
										<Form.Label>Publication</Form.Label>
										<Form.Control
											name="publication"
											type="text"
											value={values.publication}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.publication && !!errors.publication }
										/>
										<Form.Control.Feedback type='invalid'>
											{errors.publication}
										</Form.Control.Feedback>
									</Form.Group>

									<Form.Group as={Col} controlId="bookModalAuthors">
										<Form.Label>Authors</Form.Label>
										<Form.Control
											name="authors"
											type="text"
											value={values.authors}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.authors && !!errors.authors }
											placeholder="Comma separated list"
										/>
										<Form.Control.Feedback type='invalid'>
											{errors.authors}
										</Form.Control.Feedback>
									</Form.Group>
								</Row>

								<Row className="mb-3">
							    <Form.Group as={Col} controlId="bookModalPagesCount">
							      <Form.Label>Pages Count</Form.Label>
							      <Form.Control
											name="pagesCount"
											type="number"
											value={values.pagesCount}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.pagesCount && !!errors.pagesCount }
										/>
										<Form.Control.Feedback type='invalid'>
											{ errors.pagesCount }
										</Form.Control.Feedback>
							    </Form.Group>

							    <Form.Group as={Col} controlId="bookModalPubYear">
							      <Form.Label>Publication year</Form.Label>
										<Form.Control
											name="pubYear"
											type="number"
											value={values.pubYear}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={ !!touched.pubYear && !!errors.pubYear }
										/>
										<Form.Control.Feedback type='invalid'>
											{ errors.pubYear }
										</Form.Control.Feedback>
							    </Form.Group>
							  </Row>

								<div className="text-end mt-4">
									<Button className="me-3" type="submit" variant="primary" disabled={isSubmitting}>
										{isSubmitting ? "Saving..." : "Save"}
									</Button>
									<Button variant="outline-secondary" onClick={onHide}>Close</Button>
								</div>
							</Form>
			      )}
		      </Formik>
				</Modal.Body>
      </Modal>
    </>
	);
}

export default BookModal;
