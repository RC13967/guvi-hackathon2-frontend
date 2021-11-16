import './App.css';
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { createContext, useContext, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Admin, AddAdmin, ActivateAdmin, ForgotAdmin, OpenedEmailAdmin } from './Admin';
import { Client, AddClient, ActivateClient, ForgotClient, OpenedEmailClient } from './Client';
import { CrudTheatre, Edithall, Createhall, BookedData } from './CrudTheatre';
import { ShowMovies, BookTickets, SelectSeats, SelectPaymentMethod } from './BookTickets';
import { UpdateMovie, ShowTimings } from './UpdateMovie';
export const moviescontext = createContext(null);
function App() {
  const [admin, setAdmin] = useState("");
  const [client, setClient] = useState([]);
  const [email, setEmail] = useState("");
  const [theatre, setTheatre] = useState([]);
  const [movie, setMovie] = useState([]);
  const [hall, setHall] = useState([]);
  const [show, setShow] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookedSeats, setBookedSeats] = useState([]);
  const [newBookedSeats, setNewBookedSeats] = useState([]);
  const [blockedHalls, setBlockedHalls] = useState([]);
  const [blockedSeats, setBlockedSeats] = useState([]);
  return (
    <>
      <moviescontext.Provider value={{
        admin: admin, setAdmin: setAdmin, client: client, setClient: setClient, email: email, setEmail: setEmail,
        theatre: theatre, setTheatre: setTheatre, movie:movie, setMovie:setMovie, hall:hall, setHall:setHall,
        show:show, setShow:setShow, bookingDate, setBookingDate,bookedSeats:bookedSeats, setBookedSeats:setBookedSeats,
         newBookedSeats:newBookedSeats, setNewBookedSeats:setNewBookedSeats, blockedSeats, setBlockedSeats,
         blockedHalls:blockedHalls, setBlockedHalls: setBlockedHalls
      }}>
        <Navigation />
      </moviescontext.Provider>
    </>
  );
}
function Navigation() {
  const history = useHistory();
  const { setAdmin, setClient, admin, client } = useContext(moviescontext);
  const Admin = localStorage.getItem('Admin');
  const Client = localStorage.getItem('Client');
  useEffect(() => {
    setAdmin(Admin);
    setClient(Client)
  }, [Admin, Client]);
  function clearAdmin() {
    localStorage.setItem('Admin', '');
    setAdmin('');
    alert("Thanks for visiting");
    history.push("/")
  }
  function clearClient() {
    localStorage.setItem('Client', '');
    alert("Thanks for visiting");
    setClient('');
    history.push("/")
  }
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Tickets Free</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link to="/showMovies" className="nav-link">Book tickets</Link>
            </Nav>
            <Nav>
              <Link to="/loginAdmin" className="nav-link">Admin login</Link>
              <Link to="/loginClient" className="nav-link">Client login</Link>
              {admin || client ?
                <NavDropdown title="log out" id="collasible-nav-dropdown">
                  {admin ?
                    <NavDropdown.Item to="/" onClick={() => clearAdmin()}>Admin logout</NavDropdown.Item> : ""}
                  {client ?
                    <NavDropdown.Item to="/" onClick={() => clearClient()}>Client logout</NavDropdown.Item> : ""}
                </NavDropdown> : ""}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes />

    </>
  )
}
function Routes() {
  return (
    <Switch>
      <Route path="/loginAdmin">
        <Admin />
      </Route>
      <Route path="/signUpAdmin">
        <AddAdmin />
      </Route>
      <Route path="/activateAdmin/:email/:token">
        <ActivateAdmin />
      </Route>
      <Route path="/forgotAdmin">
        <ForgotAdmin />
      </Route>
      <Route path="/retrieveAdmin/:email/:token">
        <OpenedEmailAdmin />
      </Route>
      <Route path="/crudTheatre">
        <CrudTheatre />
      </Route>
      <Route path="/bookedData">
        <BookedData />
      </Route>
      <Route path="/updateMovie">
        <UpdateMovie/>
      </Route>
      <Route path="/showTimings">
        <ShowTimings/>
      </Route>
      <Route path="/edithall">
        <Edithall />
      </Route>
      <Route path="/loginClient">
        <Client />
      </Route>
      <Route path="/signUpClient">
        <AddClient />
      </Route>
      <Route path="/activateClient/:email/:token">
        <ActivateClient />
      </Route>
      <Route path="/forgotClient">
        <ForgotClient />
      </Route>
      <Route path="/retrieveClient/:email/:token">
        <OpenedEmailClient />
      </Route>
      <Route path="/showMovies">
        <ShowMovies />
      </Route>
      <Route path="/bookTickets">
        <BookTickets />
      </Route>
      <Route path="/selectSeats">
        <SelectSeats />
      </Route>
      <Route path="/selectPaymentMethod">
        <SelectPaymentMethod />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}
function Home() {
  return (
    <Container >
      <div className="home-header">Welcome!!!</div>
      <div className="home-content">To book movie tickets, click on "book tickets".</div>
      <div className="home-content">If you are client, click on "Client" to login.</div>
      <div className="home-content">If you are theatre admin, click on "Admin" to add theatre.</div>
    </Container>
  )
}
export default App;
