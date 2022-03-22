
import {useContext} from "react";
import {BrowserRouter, Routes, Route, Navigate, useParams} from "react-router-dom";
import Navigation from "./Navigation";
import Splash from "./Splash";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Favorites from "./Favorites";
import Details from "./Details";
import Contact from "./Contact";
import NotFound from "./NotFound";
import {UserContext} from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.css";

function App(){

	const {user} = useContext(UserContext);

	return (

		<BrowserRouter>

			<Navigation />

			<Routes>
				<Route index element={<Splash />} />
				<Route path="/contact" element={<Contact />} />

				{!user &&
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        }

        {user &&
          <>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
						<Route path="/login" element={<Navigate to="/home" />} />
						<Route path="/favorites" element={<Favorites />} />
						<Route path="/details/:bookId" element={<Details />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/notfound" />} />
          </>
        }
			</Routes>
		</BrowserRouter>

	);
}
export default App;
