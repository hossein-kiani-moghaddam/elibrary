
import {useContext} from "react";
import {Button, Navbar, Container, Nav} from "react-bootstrap";
import {Link, NavLink, useNavigate, useLocation} from "react-router-dom";
import {House, Heart, Telephone} from "react-bootstrap-icons";
import {UserContext} from "../context/UserContext";
import Brand from "./Brand";

function Navigation(){

	const {user, logoutUser} = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		logoutUser();
		navigate("/login");
	};

	return (
		<>
			<Navbar bg="light" expand="md" collapseOnSelect>
			  <Container>
			    <Navbar.Brand as={Link} to="/home"><Brand /></Navbar.Brand>
			    <Navbar.Toggle aria-controls="basic-navbar-nav" />
			    <Navbar.Collapse id="basic-navbar-nav">
			      <Nav className="me-auto">
			        <Nav.Link eventKey="1" as={NavLink} to="/home"><House /> Home</Nav.Link>
							<Nav.Link eventKey="2" as={NavLink} to="/favorites"><Heart /> Favorites</Nav.Link>
							<Nav.Link eventKey="3" as={NavLink} to="/contact"><Telephone /> Contact</Nav.Link>
			      </Nav>
			    </Navbar.Collapse>
			  </Container>
			</Navbar>

			<div className="bg-warning p-2">
				<Container>
					{user &&
						<div className="d-flex align-items-center justify-content-between">
							<div>Welcome <i><b>{user.userName}</b></i></div>
							<div>
								<Button style={{padding: 0, color: "blue", textDecoration: "underline"}} variant="outline-default" onClick={handleLogout}>Logout</Button>
							</div>
					</div>
					}
					{!user &&
						<div className="d-flex align-items-center justify-content-between">
							<div>Welcome <i><b>Guest</b></i></div>
							<div>
								{ location.pathname !== "/login" &&
									<Link className="ps-3" to="/login">Login</Link>
								}
								{ location.pathname !== "/register" &&
									<Link className="ps-3" to="/register">Register</Link>
								}
						</div>
						</div>
					}
				</Container>
			</div>
		</>
	);
}

export default Navigation;
