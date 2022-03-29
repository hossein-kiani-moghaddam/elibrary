
import {useContext} from "react";
import {Outlet} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import Login from "./Login";

function ProtectedRoute({children}) {
	const {user} = useContext(UserContext);

  if(!user) {
    return <Login />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
