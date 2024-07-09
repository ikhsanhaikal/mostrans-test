import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Nav className="me-auto">
            <Link to="/" className="nav-item px-2">
              Home
            </Link>
            <Link to="/characters-by-location" className="nav-item px-2">
              Character by location
            </Link>
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default App;
