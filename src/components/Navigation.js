
import {useContext} from "react";
import {Button, Navbar, Container, Nav, NavDropdown} from "react-bootstrap";
import {Link, NavLink, useLocation} from "react-router-dom";
import {House, Heart, Telephone} from "react-bootstrap-icons";
import {UserContext} from "../context/UserContext";
import Brand from "./Brand";

function Navigation(){

	const {user, logoutUser} = useContext(UserContext);

	const location = useLocation();

	const handleLogout = () => {
		logoutUser();
	};

	return (
		<>
			<Navbar bg="light" expand="md">
			  <Container>
			    <Navbar.Brand as={Link} to="/home"><Brand /></Navbar.Brand>
			    <Navbar.Toggle aria-controls="basic-navbar-nav" />
			    <Navbar.Collapse id="basic-navbar-nav">
			      <Nav className="me-auto">
			        <Nav.Link as={NavLink} to="/home"><House /> Home</Nav.Link>
							<Nav.Link as={NavLink} to="/favorites"><Heart /> Favorites</Nav.Link>
							<Nav.Link as={NavLink} to="/contact"><Telephone /> Contact</Nav.Link>
			      </Nav>
			    </Navbar.Collapse>
			  </Container>
			</Navbar>

			{location.pathname !== "/login" &&
				<div className="bg-warning p-2 mb-3">
					<Container>
						{user &&
							<div className="d-flex align-items-center justify-content-between">
								<div>Welcome <i><b>{user.userName}</b></i></div>
								<Button variant="outline-default" onClick={handleLogout}>Logout</Button>
						</div>
						}
						{!user &&
							<div className="d-flex align-items-center justify-content-between">
								<div>Welcome <i><b>Guest</b></i></div>
								<Link to="/login">Login</Link>
							</div>
						}
					</Container>
				</div>
			}
		</>
	);
}

export default Navigation;
