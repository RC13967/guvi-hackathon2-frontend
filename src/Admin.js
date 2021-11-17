import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Container, Spinner, Button, Row, Col, Form } from 'react-bootstrap';
import { useFormik } from "formik";
import * as yup from "yup";
import { moviescontext } from './App';
export function Admin() {
  const history = useHistory();
  const { setAdmin } = useContext(moviescontext);
  var Admin = localStorage.getItem('Admin');
  if (Admin){
    setAdmin(Admin);
    history.push('crudTheatre')
  }
  const [message, setMessage] = useState('');
  function getAdmin(details) {
    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/getAdmin`, {
      method: "POST",
      body: JSON.stringify(details),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((adminData) => adminData.message !== "success" ? setMessage(adminData.message)
        : (setAdmin(details.email), localStorage.setItem('Admin',details.email), history.push("/crudTheatre")));
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
      getAdmin(details);
    },
  });
  return (
    <Container>
      {message === "waiting" ?
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        :
        (message ? message : <>
          <div className="home-header">Login and add theatre</div>
          <form onSubmit={formik.handleSubmit}>
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
            <Link to="/forgotAdmin" className="link"> Forgot password? </Link><br />
            <Button variant="success" type="submit">Login</Button>
          </form><br />
          <Button variant="primary" className="centre-button" onClick={() => history.push('/signUpAdmin')}>
            Create Account</Button></>
        )}

    </Container>
  );
}
export function AddAdmin() {
  const history = useHistory();
  const [message, setMessage] = useState('');
  function checkEmail() {
    fetch("https://guvi-hackathon2-ranjith.herokuapp.com/checkAdminEmail", {
      method: "POST",
      body: JSON.stringify({ email: formik.values.email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((userdata) => setMessage(userdata.message));
  };
  function createAccount(details) {
    fetch("https://guvi-hackathon2-ranjith.herokuapp.com/AdminSignUp", {
      method: "POST",
      body: JSON.stringify(details),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((userdata) => setMessage(userdata.message));
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: yup.object({
      email: yup.string()
        .min(5, "please enter valid email")
        .required("please provide email"),
      password: yup.string()
        .min(6, "password should contain minimum 6 digits")
        .required("please provide password"),
      firstName: yup.string()
        .min(2, "please enter longer name")
        .required("please provide name"),
      lastName: yup.string()
        .min(2, "please enter longer name")
        .required("please provide name"),
    }),
    onSubmit: (details) => {
      if (message === "This email is available") {
        setMessage("waiting");
        createAccount(details);
      }
    },
  });
  useEffect(() => {
    checkEmail();
     // eslint-disable-next-line
  }, [formik.values.email]);
  return (
    <Container>
      {message === "waiting" ?
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        :

        (message !== "This email is not available. Try another" && message !== "This email is available"
          && message ? message :
          <>
            <form onSubmit={formik.handleSubmit}>
              <input className="input" placeholder="First Name" type="text" name="firstName"
                onChange={formik.handleChange} value={formik.values.firstName} />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="errors">{formik.errors.firstName}</div>
              ) : ("")}<br />
              <input className="input" placeholder="Last Name" type="text" name="lastName"
                onChange={formik.handleChange} value={formik.values.lastName} />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="errors">{formik.errors.lastName}</div>
              ) : ("")}<br />
              <input className="input" placeholder="Email" type="email" name="email"
                onChange={formik.handleChange} value={formik.values.email} />
              {formik.touched.email && formik.errors.email ? (
                <div className="errors">{formik.errors.email}</div>
              ) : ("")}
              <div className="errors">{message === "This email is not available. Try another" ? message : ""}</div>
              <input className="input" placeholder="Password" type="password" name="password"
                onChange={formik.handleChange} value={formik.values.password} />
              {formik.touched.password && formik.errors.password ? (
                <div className="errors">{formik.errors.password}</div>
              ) : ("")}<br />
              <Button variant="primary" type="submit">Create Account</Button>
            </form><br />
            Have an account?
            <Button variant="success" className="centre-button" onClick={() => history.push('/loginAdmin')}>
              Login</Button><br />
            <Link to="/forgotAdmin" className="link"> Forgot password?</Link></>
        )}
    </Container>
  );
}
export function ActivateAdmin() {
  const history = useHistory();
  const { email, token } = useParams();
  const [message, setMessage] = useState('waiting');
  function getMessage() {
    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/activateAdmin/${email}/${token}`, {
      method: "PUT",
    })
      .then((data) => data.json())
      .then((userdata) => setMessage(userdata.message));
  }
  useEffect(() => {
    getMessage();
    // eslint-disable-next-line
  }, []);
  return (
    <Container>
      {message === 'waiting' ?
        <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span> </Spinner>
        : (message === "activate account" ? <div>"Sign up success. Click
          <Button variant="contained" className="centre-button" onClick={() => history.push('/loginAdmin')}>
            Login</Button>to use the account"</div>
          : message)}
    </Container>
  );
}
export function ForgotAdmin() {
  const { email, setEmail } = useContext(moviescontext);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    if (email) {
      setMessage('waiting');
      sendEmail();
    } else {
      setError('please enter the email');
    }
  };
  function sendEmail() {
    fetch("https://guvi-hackathon2-ranjith.herokuapp.com/forgotAdmin", {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((userdata) => setMessage(userdata.message));
  };
  return (
    <Container>
      {message ? (message === 'waiting' ? <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner> : message)
        : (
          <Row>
            <Col xs='auto' sm='7' md='6' lg='4'>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)} />
                  <div className="error">
                    {error}
                  </div>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button><br />
              </Form>
            </Col>
          </Row>)}


    </Container>
  );
}
export function OpenedEmailAdmin() {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (password) {
      setMessage("waiting");
      updatePassword();
    } else {
      setError("please enter the password");
    }

  };
  const [error, setError] = useState('');
  const [message, setMessage] = useState('waiting');
  const { email, token } = useParams();
  const [password, setPassword] = useState('');
  function getMessage() {
    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/retrieveAccountAdmin/${email}/${token}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((userdata) => setMessage(userdata.message));
  }
  function updatePassword() {
    fetch(`https://guvi-hackathon2-ranjith.herokuapp.com/resetPasswordAdmin/${email}/${token}`, {
      method: "PUT",
      body: JSON.stringify({ newPassword: password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((userdata) => setMessage(userdata.message));
  };

  useEffect(() => {
    getMessage();
    // eslint-disable-next-line
  }, []);
  return (
    <Container>
      {message === 'waiting' ? <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner> : (message === "retrieve account" ?

        <Row>
          <Col xs='auto' sm='7' md='6' lg='4'>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" onChange={(event) => setPassword(event.target.value)} />
              </Form.Group>
              <div className="error">
                {error}
              </div>
              <Button variant="primary" type="submit">
                Submit
              </Button><br />
            </Form>
          </Col>
        </Row>
        : message
      )}
    </Container>
  );
}
