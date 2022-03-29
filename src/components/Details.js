
import {useState, useEffect} from "react";
import {Container, Col, Row, Image, Button} from "react-bootstrap";
import {useParams, useNavigate} from "react-router-dom";
import {Axios} from "../context/UserContext";

function Details(){
	const {bookId} = useParams();

	const [book, setBook] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
	  const fetchData = async () => {
			const {data} = await Axios.get("getBook.php", {
				params: { bookId }
			});
			setBook(data.book);
	  };
	  fetchData();
	}, [bookId]);

	return (
		<Container>
			{book && (
				<Row>

					<Col sm={4} className="pt-5">
						<Image className="thumbnail" src={`/thumbnails/${book.thumbnail}`} style={{width: "100%"}} />
					</Col>

					<Col sm={8} className="pt-5">
						<h2 className="text-info mb-3">{book.title}</h2>
						<p><b>Publication:</b> {book.publication}</p>
						<p><b>Author(s):</b> {book.authors}</p>
						<p><b>Publication year:</b> {book.pubYear}</p>
						<p><b>Pages count:</b> {book.pagesCount}</p>
					</Col>

				</Row>
			)}
			{!book && (
				"Book data is not available!"
			)}

			<div className="text-center my-5">
				<Button variant="warning" onClick={(e) => navigate("/home")}>Return</Button>
			</div>
		</Container>
	);
}

export default Details;
