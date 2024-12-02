import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

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
      .post("http://localhost:5001/login", {
        username: loginValues.userID,
        password: loginValues.password,
      })
      .then((res) => {
        alert("Login Successful!");
        navigate("/spotifylogin");
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
    <div className="container d-flex justify-content-center align-items-center vh-100">
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
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleSignup}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
