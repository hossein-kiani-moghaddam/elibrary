
import "./Book.css";
import {Row, Col, Image} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Heart, HeartFill, ThreeDots, Download} from "react-bootstrap-icons";
import {BookActions} from "../Constants";

function Book({id, title, thumbnail, pagesCount, pubYear, isFavorite, onAction}){
  const handleAction = (e, action) => {
		e.preventDefault();
		onAction(action);
  };

  return (
    <section className="book d-flex flex-column">
      <Image className="thumbnail" src={`thumbnails/${thumbnail}`} />
      <div className="info flex-grow-1 d-flex flex-column p-2 overflow-hidden">
        <header className="title h6 flex-grow-1">{title}</header>

        <Row className="details">
          <Col className="pages-count">Pages: {pagesCount}</Col>
          <Col className="pub-year text-end">&copy; {pubYear}</Col>
        </Row>

        <div className="actions text-end">
          { isFavorite === 1 &&
            <a className="me-1 link-danger" href="#" onClick={e => handleAction(e, BookActions.REMOVE_FAVORITE)}>
              <HeartFill />
            </a>
          }

          { isFavorite === 0 &&
            <a className="me-1 link-danger" href="#" onClick={e => handleAction(e, BookActions.ADD_FAVORITE)}>
              <Heart />
            </a>
          }

          <a className="me-1" href="#" onClick={e => handleAction(e, BookActions.DOWNLOAD)}>
            <Download />
          </a>

          <Link className="me-1" to={`/details/${id}`}>
            <ThreeDots />
          </Link>
        </div>
      </div>
    </section>
  );
}
// <a className="me-1 link-danger" href="#" onClick={e => handleAction(e, BookActions.REMOVE_FAVORITE)}>
//   <HeartFill />
// </a>

Book.defaultProps = {
	onAction: (action) => {}
}

export default Book;
