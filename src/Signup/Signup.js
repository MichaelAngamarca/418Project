import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [signupValues, setSignupValues] = useState({
    username: "",
    password: "",
  });
  
  const handleSignUp = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5001/signup", signupValues)
      .then((res) => {
        alert("Sign-up successful! Redirecting to login...");
        navigate("/login");
      })
      .catch((err) => alert("Error in Signing Up"));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSignupValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form
        className="p-4 bg-light rounded shadow"
        style={{ maxWidth: "400px", width: "100%" }}
        onSubmit={handleSignUp}
      >
        <h2 className="text-center mb-4">Sign Up</h2>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={signupValues.username}
            onChange={handleInputChange}
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
            name="password"
            placeholder="Enter your password"
            value={signupValues.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
