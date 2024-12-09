import React from 'react'
import "./About.css";
import ayanCooper from '../assets/images/ayan_cooper.JPG';
import renaldMendez from '../assets/images/renald_mendez.JPG';
import placeHolder from '../assets/images/placeHolder418.jpg';

const About = () => {
  return (
    <div className="about-container">
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


   <div className="container my-5">
     <h1 className="text-center mb-4">About Music Recommender</h1>
     <p className="text-center">
       Our Muisc Recommender is a web application designed to recommend music to listensers based on
       their mood. Whether you're a listener or a musician looking to share your work, this platform has something for you.
     </p>

     <div className="section">
       <h2>Features</h2>
       <ul>
         <li>Generate personalized playlists based on your mood.</li>
         <li>Upload songs as a musican to share with others.</li>
         <li>Effortlessly manage and edit your playlists.</li>
       </ul>
     </div>

     <div className="section">
       <h2>Our Mission</h2>
       <p>
         Our goal is to create an intuitive and fun music experience for everyone. We aim to
         empower users and musicians to conncet throught the joy of music.
       </p>
     </div>

     <div className="section">
      <h2>Tech Stack</h2>
      <ul>
        <li>React.js for the frontend</li>
        <li>Node.js and Express.js for the backend</li>
        <li>MongoDB for database management</li>
        <li>Bootstrap for stylizing content</li>
        <li>Spotify API for playlist generation</li>
      </ul>
     </div>

     <div className="section">
       <h2>Acknowledgements</h2>
       <p>
         This project is a collaborative effort by a passionate team of developers. We hope
         you enjoy using our Music Recommender as much as we enjoyed building it.
       </p>
     </div>
   </div> 

    <div className="cards-container">
      <div className="card">
        <img src={ayanCooper} alt="Ayan Cooper" />
        <h3>Ayan Cooper</h3>
        <p>Frontend Developer</p>
        <div className="card-links">
          <a
            href="https://www.linkedin.com/in/ayancooper/"
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            LinkedIn
          </a>
          <a
            href="mailto:adcooper@albany.edu"
            className="card-link"
          >
            Email
          </a>
        </div>
      </div>

      <div className="card">
        <img src={renaldMendez} alt="Renald Mendez" />
        <h3>Renald Mendez</h3>
        <p>Frontend Developer</p>
        <div className="card-links">
          <a
            href="https://www.linkedin.com/in/renald-mendez-074a33272/"
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            LinkedIn
          </a>
          <a
            href="mailto:rmmendez@albany.edu"
            className="card-link"
          >
            Email
          </a>
        </div>
      </div>

      <div className="card">
        <img src={placeHolder} alt="Samuel Zhao" />
        <h3>Samuel Zhao</h3>
        <p>Frontend Developer</p>
        <div className="card-links">
          <a
            href="https://www.linkedin.com/in/samzhao2893/"
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            LinkedIn
          </a>
          <a
            href="mailto:szhao3@albany.edu"
            className="card-link"
          >
            Email
          </a>
        </div>
      </div>

      <div className="card">
        <img src={placeHolder} alt="Eli Pardo" />
        <h3>Eli Pardo</h3>
        <p>Frontend Developer</p>
        <div className="card-links">
          <a
            href="https://www.linkedin.com/in/eli-pardo-994951236/"
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            LinkedIn
          </a>
          <a
            href="mailto:empardo@albany.edu"
            className="card-link"
          >
            Email
          </a>
        </div>
      </div>

      <div className="card">
        <img src={placeHolder} alt="Miguel Angamarca" />
        <h3>Miguel Angamarca</h3>
        <p>Backend Developer</p>
        <div className="card-links">
          <a
            href="https://www.linkedin.com/in/michael-angamarca-9721bb272/"
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            LinkedIn
          </a>
          <a
            href="mailto:mangamarca@albany.edu"
            className="card-link"
          >
            Email
          </a>
        </div>
      </div>
    </div>

 </div> 


  )
}

export default About