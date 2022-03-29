
import {useContext} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Navigation from "./Navigation";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Favorites from "./Favorites";
import Details from "./Details";
import Contact from "./Contact";
import NotFound from "./NotFound";
import "bootstrap/dist/css/bootstrap.css";

function App(){

	return (

		<BrowserRouter>

			<Navigation />

			<Routes>
				<Route index element={<Home />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/contact" element={<Contact />} />

				<Route element={<ProtectedRoute />}>
					<Route path="/home" element={<Home />} />
					<Route path="/favorites" element={<Favorites />} />
					<Route path="/details/:bookId" element={<Details />} />
				</Route>

				<Route path="/notfound" element={<NotFound />} />
				<Route path="*" element={<Navigate to="/notfound" />} />
			</Routes>
		</BrowserRouter>

	);
}

export default App;
