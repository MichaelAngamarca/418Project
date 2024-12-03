import React from "react";
import "./Homepage.css"; // Import CSS for record player animation

const Homepage = () => {
  return (
    <>
      <div className="record-player">
        <div className="base">
          <div className="base__screw"></div>
          <div className="base__screw"></div>
          <div className="base__screw"></div>
          <div className="base__screw"></div>
          <div className="console">
            <div className="buttons">
              <div className="button"></div>
              <div className="button"></div>
              <div className="button"></div>
            </div>
            <div className="volume"></div>
          </div>
        </div>
        <div className="record">
          <div className="record__line record__line-1"></div>
          <div className="record__line record__line-2"></div>
          <div className="record__hole"></div>
        </div>
        <div className="arm">
          <div className="arm__top"></div>
          <div className="arm__middle"></div>
          <div className="arm__bottom"></div>
        </div>
      </div>

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
    </>
  );
};

export default Homepage;
