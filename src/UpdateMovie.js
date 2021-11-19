import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Container, Button } from 'react-bootstrap';
import { useFormik } from "formik";
import * as yup from "yup";
import { moviescontext } from './App';
export function UpdateMovie() {
    const { admin, theatre } = useContext(moviescontext);
    const history = useHistory();
    const [elements, setElements] = useState(["element"]);
    const [times, setTimes] = useState([]);
    const [error, setError] = useState("");
    function addMovie(details) {
        fetch("https://guvi-hackathon2-ranjith.herokuapp.com/addMovie", {
            method: "PUT",
            body: JSON.stringify({ details: details, admin: admin, theatre: theatre, times: times }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => history.push("/crudTheatre"))
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            title: "",
            poster: "",
            overview: "",
            release_date: "",
            genres: "",
        },
        validationSchema: yup.object({
            id: yup.number()
                .required("movie id is compulsory"),
            title: yup.string()
                .required("Title is mandatory for a movie"),
            poster: yup.string()
                .required("please provide url of the movie poster"),
            release_date: yup.date()
                .required("please provide the release date"),

        }),
        onSubmit: (details) => {
            if (error !== "please start the next show only after current show is finished (maintain atleast an hour gap)"
            && error !== "dont run two shows at same time") addMovie(details);
        },
    });
    return (
        <Container>
            <div className="home-header">You can either</div> <ol>
            <li className="home-content">add the movie details</li>
            
            <form onSubmit={formik.handleSubmit}>
                <input className="input" placeholder="Movie id eg:123456" name="id"
                    onChange={formik.handleChange} value={formik.values.id} />
                {formik.touched.id && formik.errors.id ? (
                    <div className="errors">{formik.errors.id}</div>
                ) : ("")}<br />
                <input className="input" placeholder="Movie name" name="title"
                    onChange={formik.handleChange} value={formik.values.title} />
                {formik.touched.title && formik.errors.title ? (
                    <div className="errors">{formik.errors.title}</div>
                ) : ("")}<br />
                <input className="input" placeholder="Poster of the movie" name="poster"
                    onChange={formik.handleChange} value={formik.values.poster} />
                {formik.touched.poster && formik.errors.poster ? (
                    <div className="errors">{formik.errors.poster}</div>
                ) : ("")}<br />
                <input className="input" placeholder="movie story/plot/details" name="overview"
                    onChange={formik.handleChange} value={formik.values.overview} />
                {formik.touched.overview && formik.errors.overview ? (
                    <div className="errors">{formik.errors.overview}</div>
                ) : ("")}
                <div>Movie Release date
                    <input className="input" name="release_date" type="date"
                        onChange={formik.handleChange} value={formik.values.release_date} /></div>
                {formik.touched.release_date && formik.errors.release_date ? (
                    <div className="errors">{formik.errors.release_date}</div>
                ) : ("")}
                <input className="input" placeholder="genres eg: crime" name="genres"
                    onChange={formik.handleChange} value={formik.values.genres} />
                {formik.touched.genres && formik.errors.genres ? (
                    <div className="errors">{formik.errors.genres}</div>
                ) : ("")}<br />
                {elements.map((element, index) => <>
                    <ShowTimings elements={elements} setElements={setElements} times={times}
                        setTimes={setTimes} id={index} setError={setError} error={error} />
                         </>
                )}
               {times.map((time) => <div>{time}</div>)}
                <Button variant="primary" type="submit">Add movie</Button>
                <div className="errors">{error}</div>
            </form>
            <div className="home-header">OR</div>
            <li className="home-content">Add a movie from existing list</li></ol>
            <ExistingMovie admin={admin} theatre={theatre} error={error} setError={setError} />
        </Container>
    );
}
function ExistingMovie({ admin, theatre, error, setError }) {
    const history = useHistory();
    const [elements, setElements] = useState(["element"]);
    const [movieName, setMovieName] = useState('')
    const [movies, setMovies] = useState([]);
    const [film, setFilm] = useState([]);
    const [times, setTimes] = useState([]);
    const handleSubmit = () => {
        if (!film.title) setError("please search the movie name to display movies")
        else if (times.length === 0) setError("please add show timings")
        else if (error !== "please start the next show only after current show is finished (maintain atleast an hour gap)")
            addExistingMovie(film)
    }
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
    function addExistingMovie(details) {
        fetch("https://guvi-hackathon2-ranjith.herokuapp.com/addExistingMovie", {
            method: "PUT",
            body: JSON.stringify({ details: details, admin: admin, theatre: theatre, times: times }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => history.push("/crudTheatre"))
    };

    return (
        <>
        <div> search movie name here</div>
            <input className="input" placeholder="Movie name" onChange={(e) => setMovieName(e.target.value)} />
            <div className="movies-container">
                {film.length === 0 ? movies.filter((movie) => (movieName &&
                    movieName.split(" ").filter((word) =>
                        movie.title.toLowerCase().includes(word.toLowerCase())).length > 0))
                    .map((movie) => <div className="movie-card">
                        <img src={movie.poster} alt="" />
                        <div className="movie-title">{movie.title}</div>
                        <div className="movie-genre">{movie.genres.length <= 1 ? movie.genres :
                            movie.genres.map((genre) => <span>{genre}, </span>)}</div>
                        <Button variant="success" onClick={() => setFilm(movie)}>Add this movie</Button>
                    </div>
                    ) : <div>selected movie <span className="movie-title">{film.title}</span></div>}
            </div>
            <div >Add Movie timings in hall</div>
            {elements.map((element, index) => (
                <ShowTimings elements={elements} setElements={setElements} times={times}
                    setTimes={setTimes} id={index} error={error} setError={setError} />
            ))}
            <p className="errors">{error}</p>
            <Button variant="primary" onClick={handleSubmit}>Add movie</Button>
            {times.map((time) => <div>{time}</div>)}
        </>
    )
}
export function ShowTimings({ elements, times, setElements, setTimes, id, error, setError }) {
    const [time, setTime] = useState("");
    function findError(){
        if (error !== "please search the movie name to display movies"
        && error !== "please add show timings" ){
        if ([...times]
             .sort(
                 (a, b) =>
                     Number(b.slice(0, 2)) * 60 +
                     Number(b.slice(3, 5)) -
                     (Number(a.slice(0, 2)) * 60 + Number(a.slice(3, 5)))
             )
             .filter((time) =>
                 times.filter(
                     (element) =>
                         Number(time.slice(0, 2)) * 60 +
                         Number(time.slice(3, 5)) -
                         (Number(element.slice(0, 2)) * 60 +
                             Number(element.slice(3, 5))) <
                         60 &&
                         Number(time.slice(0, 2)) * 60 +
                         Number(time.slice(3, 5)) -
                         (Number(element.slice(0, 2)) * 60 +
                             Number(element.slice(3, 5))) >
                         0
                 ).length > 0
             ).length <= 0) {
 
            if (times.map((time)=>times.filter((el)=>el===time).length > 1).indexOf(true) !==-1 ){
            return "dont run two shows at same time"
            }
            else return ""
         }
         return "please start the next show only after current show is finished (maintain atleast an hour gap)"
        }
        return error
     }
    useEffect(()=>{
        setError(findError());
        // eslint-disable-next-line
    }, [times])
    return (
        <div>
            <input
                className="input"
                type="time"
                required
                onChange={(event) => setTime(event.target.value)}
                value={times[id]}
            />
            {time ? (
                <button
                    onClick={() => {
                        setElements([...elements, "element"]);
                        setTimes([...times, time]);
                        setTime("");
                    }}
                >
                    save
                </button>
            ) : (
                ""
            )}
            {elements.length > 1 ? (
                <button
                    onClick={() => {
                        setElements(elements.filter((objec, index) => id !== index));
                        setTimes(times.filter((objec, index) => index !== id));
                    }}
                >
                    -
                </button>
            ) : (
                ""
            )}
            {error !== "please search the movie name to display movies"
                && error !== "please add show timings"   ?
                ([...times]
                    .sort(
                        (a, b) =>
                            Number(b.slice(0, 2)) * 60 +
                            Number(b.slice(3, 5)) -
                            (Number(a.slice(0, 2)) * 60 + Number(a.slice(3, 5)))
                    )
                    .filter((time) =>
                        times.filter(
                            (element) =>
                                Number(time.slice(0, 2)) * 60 +
                                Number(time.slice(3, 5)) -
                                (Number(element.slice(0, 2)) * 60 +
                                    Number(element.slice(3, 5))) <
                                60 &&
                                Number(time.slice(0, 2)) * 60 +
                                Number(time.slice(3, 5)) -
                                (Number(element.slice(0, 2)) * 60 +
                                    Number(element.slice(3, 5))) >
                                0
                        ).length > 0
                    ).length <= 0 ?
                    (times.map((time)=>times.filter((el)=>el===time).length > 1).indexOf(true) ===-1 ?
                    ""
                    :setError("dont run two shows at same time")
                     )
                    :setError("please start the next show only after current show is finished (maintain atleast an hour gap)")
                    
                     ) : ""}
        </div>
    );
}