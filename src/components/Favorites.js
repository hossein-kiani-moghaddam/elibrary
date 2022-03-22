
import {Container} from "react-bootstrap";
import Home from "./Home";

function Favorites(){
	return (
		<Home favoritesOnly={true} />
	);
}

export default Favorites;
