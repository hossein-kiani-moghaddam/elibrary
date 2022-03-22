
import React from "react";
import {render} from "react-dom";
import App from "./components/App";
import {UserContextProvider} from "./context/UserContext";
import "./index.css";

render(
	<UserContextProvider>
		<App />
	</UserContextProvider>,
	document.getElementById("root")
);
