import React from "react";

const Homepage = () => {
  return (
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
          <a className="nav-item nav-link text-white" href="/generateplaylist">
            Generate A Playlist
          </a>
          <a className="nav-item nav-link text-white" href="/login">
            Login
          </a>
          <a className="nav-item nav-link text-white" href="/howtouse">
            How To Use
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Homepage;
