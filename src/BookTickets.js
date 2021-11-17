import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { moviescontext } from './App';
import { useFormik } from "formik";
import * as yup from "yup";
import { Container, Spinner, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCouch } from "@fortawesome/free-solid-svg-icons";
export function ShowMovies() {
  const history = useHistory();
  const [moviesList, setMoviesList] = useState([]);
  const { setMovie } = useContext(moviescontext);
  function getmovies() {
    fetch("https://guvi-hackathon2-ranjith.herokuapp.com/movies", {
      method: "GET"
    })
      .then((data) => data.json())
      .then((moviesdata) => setMoviesList(moviesdata));
  }
  useEffect(() => {
    getmovies();
  }, []);

  return (
    <Container className="movies-container">
      {moviesList.map((film) => <div className="movie-card">
        <img src={film.poster} alt="" />
        <div className="movie-title">{film.title}</div>
        <div className="date">Release date: {new Date(film.release_date).toLocaleString().slice(0, 9)}</div>
        <div className="movie-genre">{film.genres.length <= 1 ? film.genres :
          film.genres.map((genre) => <span>{genre}, </span>)}</div>
        <Button variant="success" onClick={() => { history.push("/bookTickets/"); setMovie(film) }}>Book</Button>
      </div>
      )}
    </Container>
  );
}
export function BookTickets() {
  const history = useHistory();
  const { movie, setHall, setShow, bookingDate, setBookingDate,
    setBlockedHalls } = useContext(moviescontext);
  const [movieHalls, setMovieHalls] = useState([]);
  // var dates = [];
  // var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // for (let i = 0; i < 6; i++) {
  //   dates.push(days[new Date(new Date().setDate(new Date().getDate() + i)).getDay()]
  //     + " " + new Date(new Date().setDate(new Date().getDate() + i)).getDate())
  // }
  var dates = ['Sun 14', 'Mon 15', 'Tue 16', 'Wed 17', 'Thu 18', 'Fri 19'];
  if (!bookingDate) setBookingDate(dates[0]);
  function getHalls() {
    fetch("https://guvi-hackathon2-ranjith.herokuapp.com/getHalls", {
      method: "POST",
      body: JSON.stringify({ "movie": movie }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((hallsData) => setMovieHalls(hallsData));
  }
  function findBlockedSeats(hall, show) {
    fetch("https://guvi-hackathon2-ranjith.herokuapp.com/getBlockedSeats", {
      method: "POST",
      body: JSON.stringify({ "hall": hall }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((blockedhalls) => setHallAndShow(blockedhalls, hall, show))
  }
  function setHallAndShow(blockedhalls, hall, show) {
    setBlockedHalls(blockedhalls);
    setShow(show);
    setHall(hall);
    history.push("/selectSeats");
  }
  useEffect(() => {
    if (movie) getHalls();
     // eslint-disable-next-line
  }, []);
  return (
    <Container>
      <img src={movie.poster} alt="" />
      <div className="movie-title">{movie.title}</div>
      <div className="movie-title">{new Date(movie.release_date).toISOString()}</div>
      <div className="movie-genre">{movie.genres.length <= 1 ? movie.genres :
        movie.genres.map((genre) => <span>{genre}, </span>)}</div>
      <div className="movie-genre">Story: {movie.overview}</div><hr />
      <div className="dates">{dates.map((date) =>
        <Button variant="secondary" onClick={() => setBookingDate(date)}>{date}</Button>)}</div><hr />
      <div className="movie-halls-container">
        {movieHalls.length > 0 ? movieHalls.map((hall) => <div className="movie-hall-container">
          <div>
            <div className="hall-name">Theatre: {hall.hallname}</div>
            <div className="hall-adress">Address: {hall.adress}</div>
          </div>
          <div className="show-times">{hall.movie.showTimes ?
            hall.movie.showTimes.filter((show) => show.date === bookingDate)[0]
              .showTimes.map((show) => <Button variant="info"
                onClick={() => findBlockedSeats(hall, show)} >{show.time}</Button>)
            : ""}
          </div>
        </div>) : ""}
      </div>
    </Container>
  );
}
export function SelectSeats() {
  const history = useHistory();
  const { hall, show, movie, bookingDate, bookedSeats, setBookedSeats, setBlockedSeats,
    blockedHalls, newBookedSeats, setNewBookedSeats } = useContext(moviescontext);
  const [seats, setSeats] = useState([]);
  const [click, setClick] = useState(true);
  let columns = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  let rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  function setColor(index) {
    let temp = seats;
    if (seats[index].color === 'red') {
      temp[index].color = 'grey';
    }
    else if (seats[index].color === 'grey') {
      temp[index].color = 'red';
    }
    setSeats(temp);
    setNewBookedSeats(seats.filter((el) => el.color === "red").map((seat) => seat.number))
  }
  function handleClick() {
    if (newBookedSeats.length > 0) {
      fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/blockSeats`, {
        method: "PUT",
        body: JSON.stringify({
          bookingDate: bookingDate, hall: hall, bookedSeats: bookedSeats,
          newBookedSeats: newBookedSeats, movie: movie, show: show,
          expire: new Date().getTime() + 60 * 1000 * 3
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      history.push("/selectPaymentMethod")
    }
    else alert("please select atleast one seat")
  }
  useEffect(() => {
    let tempBlocked = [];
    blockedHalls.map((obj) => obj.hall.movie.showTimes.filter((show) =>
      show.date === bookingDate)[0].showTimes.map((Show) => Show.time === show.time ?
        Show.bookingDetails.map((elem) =>
          tempBlocked.push(...elem.seats)) : ""))
    setBlockedSeats(tempBlocked)
    setNewBookedSeats([]);
    let bookedseats = [];
    if (show.bookingDetails) {
      show.bookingDetails.map((eachBooking) => bookedseats = [...bookedseats, ...eachBooking.seats])
    };
    setBookedSeats(bookedseats);
    let seatsDetails = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 1; j < 11; j++) {
        seatsDetails.push({
          "number": columns[j] + rows[i],
          "color": bookedseats.indexOf(columns[j] + rows[i]) === -1 && tempBlocked.indexOf(columns[j] + rows[i]) === -1
            ? "grey" : "green"
        })
      };
    };
    setSeats(seatsDetails);
 // eslint-disable-next-line
  }, []);
  return (
    <Container className="seats-page">
      <div>
        <div className="seats columns">
          {columns.map((column) => <div>{column}</div>)}
        </div>
        <div className="seats">
          {seats.length > 0 ? seats.map((seat, index) =>
            <>
              {index === 0 || index % 10 === 0 ? <div className="columns">{rows[index / 10]}</div> : ""}
              <div >
                <FontAwesomeIcon icon={faCouch} size="2x" color={seat.color} className="seat"
                  onClick={() => { setClick(!click); setColor(index) }} />
              </div>
            </>) : ""}
        </div>
      </div>
      <div>
        <div className="movie-title">Movie: {movie.title}</div>
        <hr />
        <div className="home-content">Theatre</div>
        <div className="hall-name">hall: {hall.hallname}</div>
        <div className="hall-adress">adress: {hall.adress}</div>
        <hr />
        <div className="home-content large-font">Show time</div>
        <div className="show-time">{bookingDate}</div>
        <div className="show-time">{show.time}</div>
        <hr />
        <div className="seat-numbers">{newBookedSeats.map((seat) =>
          <div className="seat-number">{seat}</div>)}</div>
        <hr />
        <div>{newBookedSeats.length} seat(s)</div>
        <Button variant="warning" onClick={() => handleClick()}>Pay ₹{100 * newBookedSeats.length}</Button>
      </div>
    </Container>
  )
}

export function SelectPaymentMethod() {
  const history = useHistory();
  const [message, setMessage] = useState("");
  const { bookingDate, hall, bookedSeats, newBookedSeats, setClient, movie,show } = useContext(moviescontext);
  const [countDown, setCountDown] = useState("");
  function bookSeats() {
    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/bookSeats`, {
      method: "PUT",
      body: JSON.stringify({
        email: Client, name: ClientName, bookingDate: bookingDate, hall: hall,
        bookedSeats: bookedSeats, newBookedSeats: newBookedSeats, movie: movie, show: show
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((data) => data.status === 200 ? setMessage("booking success"): setMessage("booking failed"))
  }
  function getClient(details) {
    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/getClient`, {
      method: "POST",
      body: JSON.stringify(details),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => data.message ? setMessage(data.message)
        : (setClient(data.client), localStorage.setItem('Client', data.client[0].email), setMessage(""),
          localStorage.setItem('ClientName', data.client[0].firstName + " " + data.client[0].lastName)));
  }
  const Client = localStorage.getItem("Client");
  const ClientName = localStorage.getItem("ClientName");
  function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var intervalId = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display = minutes + ":" + seconds;
      if (timer < 0) {
        clearInterval(intervalId)
        alert("time out");
        history.push("/showMovies")
      }
      timer = timer - 1
      setCountDown(display);
    }, 1000);
  }
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string()
        .min(5, "please enter valid email")
        .required("please provide email"),
      password: yup.string()
        .min(6, "password should contain minimum 6 digits")
        .required("please provide password"),
    }),
    onSubmit: (details) => {
      setMessage("waiting");
      getClient(details);
    },
  });
  useEffect(() => {
    startTimer(180);
     // eslint-disable-next-line
  }, []);
  function handleClick() {
    if (!Client) {
      alert("please login")
    }
    else {
      setMessage("waiting2")
      bookSeats()
    }
  }
  return (
    <Container>
      {message==="booking success" ? "Booking successfull. Details sent to email." :
      message==="booking failed" ? "Booking failed. Please check your connection / try again." :<>
      {message==="waiting2" ? <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>:<>{message ==="waiting" ? <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>:<>
      {!Client ? <> <form onSubmit={formik.handleSubmit}>
        <input className="input" placeholder="Email" type="email" name="email"
          onChange={formik.handleChange} value={formik.values.email} />
        {formik.touched.email && formik.errors.email ? (
          <div className="errors">{formik.errors.email}</div>
        ) : ("")}<br />
        <input className="input" placeholder="Password" type="password" name="password"
          onChange={formik.handleChange} value={formik.values.password} />
        {formik.touched.password && formik.errors.password ? (
          <div className="errors">{formik.errors.password}</div>
        ) : ("")}<br />
        <Link to="/forgotClient" className="link"> Forgot password? </Link><br />
        <Button variant="success" type="submit">Login</Button>
      </form>
        <Button variant="primary" className="centre-button" onClick={() => history.push('/signUpClient')}>
          Create Account</Button></> : ""}</>}
      <div className="movie-title">Movie Name: {movie.title}</div>
      <div className="show-time">booking date: {bookingDate}</div>
      <div className="show-time">show time: {show.time}</div>
      <div className="seatnumbers">Seats: {newBookedSeats}</div>
      <div className="hall-name">Theatre: {hall.hallname}</div>
      <div className="hall-adress">theatre address: asdfg{hall.adress}</div>
      <Button variant="warning" onClick={() => handleClick()}>{countDown}</Button></>}
</>}
    </Container>
  )
}
