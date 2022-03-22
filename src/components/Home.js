
import {useContext, useState, useEffect} from "react";
import {Container, Button, ToastContainer, Toast} from "react-bootstrap";
import {Plus} from "react-bootstrap-icons";
import Downloader from 'js-file-downloader';
import {Axios} from "../context/UserContext";
import Brand from "./Brand";
import BookModal from "./BookModal";
import BooksList from "./BooksList";
import {BookActions} from "../Constants";

function Home({favoritesOnly = false}){
	const [books, setBooks] = useState([]);
	const [showBookModal, setShowBookModal] = useState(false);
	const [toastMessage, setToastMessage] = useState("(empty)");
	const [showToast, setShowToast] = useState(false);

	const handleFavorite = async (bookId, isFavorite) => {
		try{
			let formData = new FormData();
			formData.append("bookId", bookId);
			formData.append("isFavorite", isFavorite);
			const {data} = await Axios.post("editFavorite.php", formData, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			});

			if(data.result === 0){
				const {data} = await Axios.get("books.php", {
					params: { favoritesOnly }
				});
				setBooks(data.books);
			}
			else{
				console.log("Some errors occured while changing favorite!");
			}
		}
		catch(error){
			console.log("error occured: ", error);
		}

		// let formData = new FormData();
		// formData.append("bookId", bookId);
		// formData.append("isFavorite", isFavorite);
		// Axios.post("editFavorite.php", formData, {
		// 	headers: {
		// 		"Content-Type": "application/x-www-form-urlencoded"
		// 	}
		// })
		// 	.then(({data}) => {
		// 		if(data.result === 0){
		// 			setBooks(data.books);
		// 		}
		// 		else{
		// 			console.log("Some errors occured while editting favorite!");
		// 		}
		// 	})
		// 	.catch(error => {
		// 		console.log("error occured: ", error);
		// 	});
	}

	const handleDownload = (bookId) => {
		const fileUrl = 'http://localhost/elibrary/public/api/download.php';
		let params = new URLSearchParams();
		params.append("bookId", bookId);

		new Downloader({
	    url: fileUrl + "?" + params.toString()
	  })
		  .then((data) => {
				toast("Download completed.");
		  })
		  .catch((error) => {
				toast("Error in downloading book!");
		  });
	};

	const handleShowBookModal = () => setShowBookModal(true);
	const handleCloseBookModal = () => setShowBookModal(false);
	const handleAfterSaveBookModal = (books) => {
		setShowBookModal(false);
		setBooks(books);
	};
	const handleAction = (action, bookId) => {
		switch(action){
			case BookActions.ADD_FAVORITE:
				handleFavorite(bookId, 1);
				break;

			case BookActions.REMOVE_FAVORITE:
				handleFavorite(bookId, 0);
				break;

			case BookActions.DOWNLOAD:
				handleDownload(bookId);
				break;

			default:
				console.log("Invalid BookAction!");
				break;
		}
	};

	useEffect(() => {
    Axios.get("books.php", {
			params: {
				favoritesOnly
			}
		})
      // .then(({data}) => console.log(data));
			.then(({data}) => setBooks(data.books));
	}, []);

	const toast = (msg) => {
		setToastMessage(msg);
		setShowToast(true);
	};

	return (
		<Container className="home">
			<div className="books-list mb-3">
				<BooksList books={books} onAction={handleAction} />

				<Button className="float-button" variant="primary" onClick={handleShowBookModal}><Plus size={40} /></Button>
			</div>

			<ToastContainer position="bottom-center" className="position-fixed mb-3">
				<Toast className="text-white" show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="danger">
					<Toast.Body>
						{toastMessage}
					</Toast.Body>
				</Toast>
			</ToastContainer>

			<BookModal show={showBookModal} afterSave={handleAfterSaveBookModal} onHide={handleCloseBookModal} />
		</Container>
	);
}

export default Home;
