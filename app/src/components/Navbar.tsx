import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <BootstrapNavbar bg="light" expand="lg">
      <Container>
        <BootstrapNavbar.Brand href="#home">Highschool App</BootstrapNavbar.Brand>
        <Nav className="ml-auto">
          <Nav.Item className="ml-auto">
            <Button variant="secondary" onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              navigate('/login')
            }}>
              Log out
            </Button>
          </Nav.Item>
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;