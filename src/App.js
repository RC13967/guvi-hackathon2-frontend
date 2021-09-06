import './App.css';
import { Link, Route, Switch, useParams } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
const moviescontext = createContext(null);
function App() {
  const [movies, setMovies] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState([]);
  const [newAdress, setnewAdress] = useState("");
  const [newTitle, setnewTitle] = useState("");
  const [newHallname, setnewHallname] = useState("");
  return (
    <>
      <moviescontext.Provider value={{
        movies: movies, setMovies: setMovies,
        username: username, setUsername: setUsername, password: password, setPassword: setPassword,
        user: user, setUser: setUser, newAdress: newAdress, newHallname: newHallname, newTitle: newTitle,
        setnewAdress: setnewAdress, setnewHallname: setnewHallname, setnewTitle: setnewTitle
      }}>
        <Routes />
      </moviescontext.Provider>

    </>
  );
}
function Routes() {
  return (
    <Switch>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/client">
        <Client />
      </Route>
      <Route path="/book/:title">
        <Bookticket />
      </Route>
      <Route path="/crudtheatre">
        <Crudtheatre />
      </Route>
      <Route path="/edithall/:id">
        <Edithall />
      </Route>
      <Route path="/createhall/:id">
        <Createhall />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}
function Home() {
  return (
    <>
      <div>
        <Link to="/admin">Admin</Link>
      </div>
      <div>
        <Link to="/client">Client</Link>
      </div>
    </>
  )

}
function Admin() {
  const history = useHistory();
  const [buttonText, setButtonText] = useState("Login");
  const { username, password, setUsername, setPassword, setUser } = useContext(moviescontext);
  function adduser() {

    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/addUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: username, password:password, halls:[] })
    })
      .then((data) => data.json())
      .then((userdata) => setUser(userdata))
      .then(()=> history.push("/crudtheatre"))
  }
  return (
    <>
      <input type="text" placeholder="user name ..." onChange={(event) => setUsername(event.target.value)} />
      <input type="text" placeholder="password ..." onChange={(event) => setPassword(event.target.value)} />
      <button className="pointer" onClick={() =>  
        buttonText === "Login" ? history.push("/crudtheatre") : adduser()  }>
        {buttonText}</button>
      <div>{buttonText === "Login" ? "New user ?" : "Already existing user ?"}</div>
      <div onClick={() => setButtonText(buttonText === "Login" ? "sign up" : "Login")}>
        {buttonText === "Login" ? "sign up" : "Login"}
      </div>

    </>
  )

}

function Crudtheatre() {
  const [newHallId, setnewHallId] = useState(0);
  const history = useHistory();
  const { username, password, user, setUser, setnewHallname, setnewTitle, setnewAdress } = useContext(moviescontext);
  function getusers() {
    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/user`, {
      method: "GET",
      body: JSON.stringify({ username: username, password:password })
    })
      .then((data) => data.json())
      .then((userdata) => setUser(userdata));
  }
  useEffect(() => {
    getusers();
  }, []);
  return (
    <>
    {(user[0] === undefined || user[0].username !== username || password !== user[0].password)
    ?"Invalid credentials" :<>
      <input type="text" placeholder="Hall name" onChange={(event) => setnewHallname(event.target.value)} />
      <input type="text" placeholder="Running movie name" onChange={(event) => setnewTitle(event.target.value)} />
      <input type="text" placeholder="Address of the hall" onChange={(event) => setnewAdress(event.target.value)} />
      <button onClick={() => {
        setnewHallId(Math.max(...user[0].halls.map((hall) => +hall.id)) + 1);
        history.push("/createhall/" + newHallId)
      }}>Add Hall</button>
      <div className="halls-container">
        {user[0].halls.map(({ adress, hallname, title, id }) =>
          <div className="hall-container">
            <div className="hall-name">{hallname}</div>
            <div className="movie-title">{title}</div>
            <div className="hall-adress">{adress}</div>
            <button onClick={() => history.push("/edithall/" + id)}>Edit hall</button>
            <button onClick={() => deletehall(id)}>Delete hall</button>
          </div>
        )}
      </div>
      </>}
    </>
  )

  function deletehall(id) {
    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/hall/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: username })
    })
      .then((data) => data.json())
      .then(() => getusers())
  }
}

function Edithall() {
  const { user, username } = useContext(moviescontext);
  const { id } = useParams();
  let [{ adress, hallname, title }] = user[0].halls.filter((hall) => hall.id === id);
  const [Adress, setAdress] = useState(adress);
  const [Title, setTitle] = useState(hallname);
  const [Hallname, setHallname] = useState(title);

  fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/edithall/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ hallname: Hallname, adress: Adress, title: Title, username: username })
  })
    .then((data) => data.json())

  return (
    <div>
      <input type="text" placeholder={Hallname} onChange={(event) => setHallname(event.target.value)} />
      <input type="text" placeholder={Title} onChange={(event) => setTitle(event.target.value)} />
      <input type="text" placeholder={Adress} onChange={(event) => setAdress(event.target.value)} />
      <Link to="/crudtheatre">Updated list</Link>
    </div>
  )
}
function Createhall() {
  const { username, newHallname, newAdress, newTitle } = useContext(moviescontext);
  const { id } = useParams();
  fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/edithall/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ hallname: newHallname, adress: newAdress, title: newTitle, username: username })
  })
    .then((data) => data.json())
  return (
    <Link to="/crudtheatre">Hall list</Link>
  )
}
function Client() {
  const history = useHistory();
  const { movies, setMovies } = useContext(moviescontext);
  function getmovies() {
    fetch("https://guvi-hackathon2-ranjith.herokuapp.com/movies", {
      method: "GET"
    })
      .then((data) => data.json())
      .then((moviesdata) => setMovies(moviesdata));
  }
  useEffect(() => {
    getmovies();
  });

  return (
    <div className="movies-container" >
      {movies.map(({ poster, title, genres }) =>
        <div className="movie-card" >
          <img src={poster} alt="" />
          <div className="movie-title">{title}</div>
          <div className="movie-genre">{genres}</div>
          <button className="pointer" onClick={() => history.push("/book/" + title)}>Book</button>

        </div>
      )}
    </div>
  )
}
function Bookticket() {
  const { movies } = useContext(moviescontext);
  const { title } = useParams();
  const movie = movies.filter((obj) => obj.title = title)
  return (
    <div>{movie.genres}</div>
  )
}
export default App;
