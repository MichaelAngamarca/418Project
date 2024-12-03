import React from 'react'
// Added commment to check commit

const About = () => {
  return (
    <div>
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


   <div className="container my-5">
     <h1 className="text-center mb-4">About Music Recommender</h1>
     <p className="text-center">
       Our Muisc Recommender is a web application designed to recommend music to listensers based on
       their mood. Whether you're a listener or a musician looking to share your work, this platform has something for you.
     </p>
     <div className="mt-4">
       <h2>Features</h2>
       <ul>
         <li>Generate personalized playlists based on your mood.</li>
         <li>Upload songs as a musican to share with others.</li>
         <li>Effortlessly manage and edit your playlists.</li>
       </ul>
     </div>
     <div className="mt-4">
       <h2>Our Mission</h2>
       <p>
         Our goal is to create an intuitive and fun music experience for everyone. We aim to
         empower users and musicians to conncet throught the joy of music.
       </p>
     </div>
     <div className="mt-4">
       <h2>Acknowledgements</h2>
       <p>
         This project is a collaborative effort by a passionate team of developers. We hope
         you enjoy using our Music Recommender as much as we enjoyed building it.
       </p>
     </div>
   </div> 
 </div> 


  )
}

export default About