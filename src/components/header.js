import * as React from "react";
import { Navbar, Nav, Container, Form, FormControl, Button } from "react-bootstrap";
import { Link } from "gatsby";
import "./header.css";

const Header = ({ siteTitle }) => {
  return (
    <Navbar className="navbar-fixed" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">{siteTitle}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/*Links for NavBar*/}
          <Nav className="nav-link">
            <Nav.Link as={Link} to="/" className="highlight-hover">Home</Nav.Link>
            <Nav.Link as={Link} to="/recipes" className="highlight-hover">Recipes</Nav.Link>
            <Nav.Link as={Link} to="/meal-plans" className="highlight-hover">Meal Plans</Nav.Link>
            <Nav.Link as={Link} to="/budget" className="highlight-hover">Budget</Nav.Link>
          </Nav>
          {/*Search Bar*/}
          <Form className="d-flex ms-auto">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
