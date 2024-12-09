import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UploadSong = () => {
  const [songLink, setSongLink] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!songLink.trim()) {
      setMessage("Please enter a valid Spotify song link.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/uploadSong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songLink }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Song uploaded successfully!");
      } else {
        setMessage(data.message || "Failed to upload the song.");
      }
    } catch (error) {
      console.error("Error uploading song:", error);
      setMessage("An error occurred. Please try again.");
    }

    setSongLink("");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <a className="navbar-brand text-white" href="/">
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
            <a className="nav-item nav-link text-white" href="/">
              Home
            </a>
            <a className="nav-item nav-link text-white" href="/generateplaylist">
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
          </div>
        </div>
      </nav>
      <div className="container mt-5 text-center">
        <h1>Upload Song</h1>
        <div className="d-flex justify-content-center mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Enter Spotify Song Link"
            value={songLink}
            onChange={(e) => setSongLink(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleUpload}>
          Upload Song
        </button>
        {message && <p className="mt-3">{message}</p>}
      </div>
    </>
  );
};

export default UploadSong;
