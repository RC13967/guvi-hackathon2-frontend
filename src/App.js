import './App.css';
import { Link, Route, Switch, Redirect, useParams } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
const moviescontext = createContext(null);
function App() {
  const [movies, setMovies] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <moviescontext.Provider value={{
        movies: movies, setMovies: setMovies,
        username: username, setUsername: setUsername, password: password, setPassword: setPassword
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
  const { setUsername, setPassword } = useContext(moviescontext);
  return (
    <>
      <input type="text" placeholder="user name ..." onChange={(event) => setUsername(event.target.value)} />
      <input type="text" placeholder="password ..." onChange={(event) => setPassword(event.target.value)} />

      <Link to="crudtheatre"><button className="pointer">Upload movie</button></Link>

    </>
  )

}
function Crudtheatre() {
  const [user, setUser] = useState([]);
  const { username, password } = useContext(moviescontext);
  function getusers(){
    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/users/${username}`, {
      method: "GET"
    })
      .then((data) => data.json())
      .then((userdata)=> handleData(userdata));
  }
  useEffect(() => {
    getusers();
  }, []);
  
  function handleData(userdata){
    const myData = {
      data: userdata,
    };
    setUser([...user, myData]);
  };
  let halls = [];
  if(user[0] === undefined || user[0].data[0] === undefined || user[0].data[0].password !== password){
    return(
      <>
      Invalid credentials
      </>
    )
  }
  let hallsObject = user.map((obj)=>obj.data[0].halls);
  for(let hallkey in hallsObject[0]){
  halls.push(hallsObject[0][hallkey])
  }
  return(
    <div className="halls-container">
    {halls.map(({adress, hallname, title})=>
    <div className="hall-container">
      <div className="hall-name">{hallname}</div>
      <div className="movie-title">{title}</div>
      <div className="hall-adress">{adress}</div>
      <button onclick = {()=>edithall(hallname)}>Edit hall</button>
      <button onclick = {()=>deletehall(hallname)}>Delete hall</button>
    </div>
    )} 
    </div>
  )
  function edithall(hallname){
return
  }
  function deletehall(hallname){
    return 
    
  }
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
  }, []);

  return (
    <div className="movies-container" >
      {movies.map(({ poster, title, genres }) =>
        <div className="movie-card" >
          <img src={poster} />
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
