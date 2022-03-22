
import Book from './Book.js';

function BooksList({books, onAction}){
	return (
		<div className="books-list d-flex flex-wrap gap-3 justify-content-between my-3">
			{
				(books.length === 0) ?
					<div>List is empty</div> :
					books.map(book => (
						<Book {...book} key={book.id} onAction={action => onAction(action, book.id)} />
					))
			}
		</div>
	);
}

BooksList.defaultProps = {
	books: [],
	onAction: () => {}
};

export default BooksList;
