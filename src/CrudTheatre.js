import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Container, Button, Spinner, Table } from 'react-bootstrap';
import { moviescontext } from './App';
import { useFormik } from "formik";
import * as yup from "yup";
export function CrudTheatre() {
  const [halls, setHalls] = useState([]);
  const [message, setMessage] = useState('');
  const history = useHistory();
  const { admin, setTheatre } = useContext(moviescontext);
  function getHalls() {
    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/halls`, {
      method: "POST",
      body: JSON.stringify({ email: admin }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((hallsData) => { setHalls(hallsData); setMessage("got halls") })
  };
  useEffect(() => {
    getHalls();
     // eslint-disable-next-line
  }, []);
  function checkHall(details) {
    fetch("https://guvi-hackathon2-ranjith.herokuapp.com/checkHall", {
      method: "POST",
      body: JSON.stringify(details),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((userdata) => userdata.message !== "This hall details is available" ? setMessage(userdata.message)
       : (setMessage("waiting"), addHall(details)))
  };
  function addHall(details) {
    fetch("https://guvi-hackathon2-ranjith.herokuapp.com/addHall", {
      method: "PUT",
      body: JSON.stringify({ hallname: details.hallname, title: details.title, adress: details.adress, admin: admin }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => getHalls())
  };
  const formik = useFormik({
    initialValues: {
      hallname: "",
      title: "",
      adress: "",
    },
    validationSchema: yup.object({
      hallname: yup.string()
        .required("please provide hall name"),
      adress: yup.string()
        .min(5, "please provide more details")
        .required("please provide the hall adress"),
    }),
    onSubmit: (details) => {
      checkHall(details)
    },
  });
  function deletehall(hallname, adress) {
    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/deleteHall`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ admin: admin, hallname: hallname, adress: adress })
    })
      .then((data) => data.json())
      .then(() => getHalls());
  }
  return (
    <Container>
      <form onSubmit={formik.handleSubmit}>
        <input className="input" placeholder="Hall Name" type="text" name="hallname"
          onChange={formik.handleChange} value={formik.values.hallname} />
        {formik.touched.hallname && formik.errors.hallname ? (
          <div className="errors">{formik.errors.hallname}</div>
        ) : ("")}<br />
        <textarea rows="5" cols="35" className="input" placeholder="Address of the hall" type="text" name="adress"
          onChange={formik.handleChange} value={formik.values.adress} />
        {formik.touched.adress && formik.errors.adress ? (
          <div className="errors">{formik.errors.adress}</div>
        ) : ("")}<br />

        <Button variant="primary" type="submit">Add Hall</Button>
      </form>
      <div className="errors">{message === "This hall details is not available. Try another" ? message : ""}</div>
      <div className="errors">{message === "waiting" ?
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner> : ""}</div>
        {!message ?<Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner> :<>
        {message === "got halls" ?
      <div className="halls-container">
        {halls.length > 0 ? (halls.map((hall) => <div className="hall-container">
          <div className="hall-name">Theatre name: {hall.hallname}</div>
          <div className="hall-adress">Address: {hall.adress}</div>
          <Button onClick={() => { setTheatre(hall); history.push("/edithall") }} className="button">Edit hall</Button>
          <Button variant="danger" onClick={() => {
            setMessage("waiting"); deletehall(hall.hallname, hall.adress)
          }} className="button">Delete hall</Button><br/>
          <Button variant="success" className="button"
            onClick={() => { setTheatre(hall); history.push("/updateMovie") }}>Update Movie
          </Button>
          {hall.movie ? <>
            <div className="movie-id">Movie id: {hall.movie.id}</div>
            <div className="movie-title">{hall.movie.title}</div>
          <img className="movie-poster" src = {hall.movie.poster}  alt = ""/>
          <div className="movie-date">{hall.movie.releaseDate}</div>
          <div className="movie-genre">{hall.movie.genres.length <=1 ? hall.movie.genres :
        hall.movie.genres.map((genre)=><span>{genre}, </span>)}</div>
          <Button variant="warning" className="button"
            onClick={() => { setTheatre(hall); history.push("/bookedData") }}>Booked seats
          </Button><br /><br />
          </>  : ""}
          
        </div>
        )) : "No halls registered"}
      </div>:""}</>}

    </Container>
  );
}
export function BookedData(){
  const [shows, setShows] = useState([]);
  const [bookedDetails, setBookedDetails] = useState([]);
  const {theatre} = useContext(moviescontext);
  console.log(shows)
  return(
    <Container>{!theatre.movie.showTimes ? "No seats are booked":<>
    {theatre.movie.showTimes.map((Show, index)=>
    <Button className="button" variant = "info" onClick ={()=>setShows(Show.showTimes)}>{Show.date}</Button>)}<br/>
    {shows ? shows.map((Show, index)=>
    <Button  className="button" variant = "warning" onClick = {()=>setBookedDetails(Show.bookingDetails)}>{Show.time}</Button>) :""}<br/>
   <Table><thead><tr>
      <th>Name</th>
            <th>email</th>
            <th>booked seats</th>
          </tr>
        </thead>
      <tbody> {bookedDetails ? bookedDetails.map((booked)=><tr>
      <td>{booked.name}</td>
    <td>{booked.email}</td>
    <td>{booked.seats.map((seat)=><span>{seat}, </span>)}</td></tr>
    ) :""}</tbody></Table></>}
    </Container>
  )
}
export function Edithall() {
  const [message, setMessage] = useState('');
  const history = useHistory();
  const { admin, theatre } = useContext(moviescontext);
  function checkHall(details) {
    fetch("https://guvi-hackathon2-ranjith.herokuapp.com/checkHall", {
      method: "POST",
      body: JSON.stringify(details),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((userdata) => userdata.message !== "This hall details is available" ?
          setMessage(userdata.message) : (setMessage("waiting"), updateHall(details)))
  };
  function updateHall(details) {
    fetch("https://guvi-hackathon2-ranjith.herokuapp.com/updateHall", {
      method: "PUT",
      body: JSON.stringify({
        newHallName: details.hallname, newAdress: details.adress, admin: admin,
        oldHallName: theatre.hallname, oldAdress: theatre.adress
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => history.push("/crudTheatre"))
  };
  const formik = useFormik({
    initialValues: {
      hallname: "",
      adress: "",
    },
    validationSchema: yup.object({
      hallname: yup.string()
        .required("please provide hall name"),
      adress: yup.string()
        .min(5, "please provide more details")
        .required("please provide the hall adress"),
    }),
    onSubmit: (details) => {
      checkHall(details)
    },
  });
  return (
    <Container>
      <form onSubmit={formik.handleSubmit}>
        <input className="input" placeholder="Hall Name" type="text" name="hallname"
          onChange={formik.handleChange} value={formik.values.hallname} />
        {formik.touched.hallname && formik.errors.hallname ? (
          <div className="errors">{formik.errors.hallname}</div>
        ) : ("")}<br />
        <textarea rows="5" cols="35" className="input" placeholder="Address of the hall" type="text" name="adress"
          onChange={formik.handleChange} value={formik.values.adress} />
        {formik.touched.adress && formik.errors.adress ? (
          <div className="errors">{formik.errors.adress}</div>
        ) : ("")}<br />

        <Button variant="primary" type="submit">Update Hall</Button>
      </form>
      <div className="errors">{message === "This hall details is not available. Try another" ? message : ""}</div>

    </Container>
  );
}
