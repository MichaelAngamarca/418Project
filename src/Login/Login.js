import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "./Login.css";
const Login = () => {
  const [loginValues, setLoginValues] = useState({
    userID: "",
    password: "",
  });

  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5001/userlogin", {
        username: loginValues.userID,
        password: loginValues.password,
      })
      .then((res) => {
        alert("Login Successful!");
      })
      .catch((err) => {
        alert(err.response.data.message || "Error In Login");
      });
  };

  // Function to handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Function to handle navigation to signup
  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <a className="navbar-brand text-white" href="/public">
          Spotify Playlist Maker
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-item nav-link text-white active" href="/">
              Home
            </a>
            <a
              className="nav-item nav-link text-white"
              href="/generateplaylist"
            >
              Generate A Playlist
            </a>
            <a className="nav-item nav-link text-white" href="/uploadsong">
              Upload A Song
            </a>
            <a className="nav-item nav-link text-white" href="/login">
              Login
            </a>
            <a className="nav-item nav-link text-white" href="/signup">
              Signup
            </a>
            <a className="nav-item nav-link text-white" href="/howtouse">
              How To Use
            </a>
           
          </div>
        </div>
       
      </nav>
      
      <div className="contain  d-flex justify-content-center align-items-center vh-100">
        <form
          className="p-4 bg-light rounded shadow"
          style={{ maxWidth: "400px", width: "100%" }}
          onSubmit={handleLogin} // Ensures default form submission is prevented
        >
          <h3 className="text-center mb-4">Login</h3>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="userID" // Match the key in the state
              value={loginValues.userID} // Bind to state
              onChange={handleInputChange} // Handle changes
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password" // Match the key in the state
              value={loginValues.password} // Bind to state
              onChange={handleInputChange} // Handle changes
              placeholder="Enter your password"
              required
            />
          </div>
         
          <div className=" d-flex justify-content-center align-items-center">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            </div>
            
          
        </form>
      </div>
      <div className = " signOption  justify-content-center align-items-center">
     
        <div className = "center"> <h3 className="text-center mb-4">Are You New Here?</h3>
        <h4 className="text-center mb-4">If so, Sign Up Instead</h4>
        </div>
        <div className=" d-flex justify-content-center align-items-center">
       <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSignup}
            >
             Sign Up
            </button>
            </div>
      </div>
    </>
  );
};

export default Login;
