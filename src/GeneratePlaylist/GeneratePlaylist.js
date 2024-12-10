import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GeneratePlaylist.css";

const CLIENT_ID = "7e8604cda2934a38874eeb19205ec10e";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URI = "http://localhost:3000/generateplaylist";
const SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-read-collaborative",
];
const SCOPES_URL_PARAM = SCOPES.join("%20");

const GeneratePlaylist = () => {
  const [playlistLink, setPlaylistLink] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (window.location.hash) {
      const { access_token } = window.location.hash
        .substring(1)
        .split("&")
        .reduce((acc, curr) => {
          const [key, value] = curr.split("=");
          acc[key] = value;
          return acc;
        }, {});

      localStorage.setItem("accessToken", access_token);
      fetchUserProfile(access_token);
    }
  }, []);

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setUserProfile({
        name: data.display_name,
        image: data.images[0]?.url,
        profileUrl: data.external_urls.spotify,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  const extractPlaylistId = (url) => {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const createNewPlaylistFromLink = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const playlistId = extractPlaylistId(playlistLink);

    if (!accessToken || !playlistId) {
      alert("Please login and provide a valid playlist link.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();

      const tracks = data.items.map((item) => ({
        name: item.track.name,
        uri: item.track.uri,
        artistId: item.track.artists[0].id,
      }));

      const artistGenres = await Promise.all(
        tracks.map((track) =>
          fetch(`https://api.spotify.com/v1/artists/${track.artistId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }).then((res) => res.json())
        )
      );

      const allGenres = artistGenres
        .flatMap((artist) => artist.genres)
        .reduce((acc, genre) => {
          acc[genre] = (acc[genre] || 0) + 1;
          return acc;
        }, {});

      const sortedGenres = Object.entries(allGenres)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      const topGenres = sortedGenres.map(([genre]) => genre);

      const genreSearchResults = await Promise.all(
        topGenres.map((genre) =>
          fetch(
            `https://api.spotify.com/v1/search?q=genre:${genre}&type=track&limit=5`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          ).then((res) => res.json())
        )
      );

      const newTracks = genreSearchResults.flatMap((result) =>
        result.tracks.items.map((track) => ({
          name: track.name,
          uri: track.uri,
        }))
      );

      if (newTracks.length === 0) {
        alert("No tracks found for the selected genres.");
        return;
      }

      setFilteredTracks(newTracks);
      await createSpotifyPlaylist(
        newTracks,
        accessToken,
        "Generated Playlist from Link"
      );
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const regeneratePlaylist = () => {
    // Clear current state
    setFilteredTracks([]);
    setPlaylistDetails(null);

    // Regenerate based on last action
    if (playlistLink) {
      createNewPlaylistFromLink();
    } else if (genreInput) {
      createPlaylistFromGenres();
    }
  };

  const createPlaylistFromGenres = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || !genreInput.trim()) {
      alert("Please login and enter at least one genre.");
      return;
    }

    try {
      const genreSearchResults = await fetch(
        `https://api.spotify.com/v1/search?q=genre:${genreInput}&type=track&limit=20`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      ).then((res) => res.json());

      const newTracks = genreSearchResults.tracks.items.map((track) => ({
        name: track.name,
        uri: track.uri,
      }));

      if (newTracks.length === 0) {
        alert("No tracks found for the entered genres.");
        return;
      }

      setFilteredTracks(newTracks);
      await createSpotifyPlaylist(
        newTracks,
        accessToken,
        "Generated Playlist from Genres"
      );
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const createSpotifyPlaylist = async (tracks, accessToken, playlistName) => {
    const userIdResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userIdData = await userIdResponse.json();

    const createPlaylistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userIdData.id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
          description: "Generated by React App",
          public: false,
        }),
      }
    );

    const playlistData = await createPlaylistResponse.json();

    console.log("Playlist Data:", playlistData);

    await fetch(
      `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: tracks.map((track) => track.uri),
        }),
      }
    );

    setTimeout(async () => {
      const updatedPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const updatedPlaylistData = await updatedPlaylistResponse.json();

      console.log("Updated Playlist Data:", updatedPlaylistData);

      setPlaylistDetails({
        name: updatedPlaylistData.name,
        image: updatedPlaylistData.images[0]?.url,
        link: updatedPlaylistData.external_urls.spotify,
      });

      window.open(updatedPlaylistData.external_urls.spotify, "_blank");
    }, 2000);
    alert("Playlist created successfully!");
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
      <div className="container mt-5 text-center">
        {userProfile && (
          <div
            className="profile-icon"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <a
              href={userProfile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={userProfile.image || "https://via.placeholder.com/50"}
                alt="User Profile"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                }}
              />
            </a>
          </div>
        )}
        <div className="muzieknootjes">
          <div className="noot-1">&#9835; &#9833;</div>
          <div className="noot-2">&#9833;</div>
          <div className="noot-3">&#9839; &#9834;</div>
          <div className="noot-4">&#9834;</div>
        </div>
        <h1 className="text-white">Generate Playlist</h1>
        <div className="d-flex justify-content-center mb-3">
          <input
            type="text"
            className="form-control w-50 me-2"
            placeholder="Enter Spotify Playlist Link"
            value={playlistLink}
            onChange={(e) => setPlaylistLink(e.target.value)}
          />
        </div>
        <input
          type="text"
          className="form-control w-50 mx-auto mb-3"
          placeholder="Enter Genres (comma-separated)"
          value={genreInput}
          onChange={(e) => setGenreInput(e.target.value)}
        />
        <div className="d-flex justify-content-center gap-3 mb-3">
          <button className="btn btn-dark" onClick={createNewPlaylistFromLink}>
            Generate Playlist from Link
          </button>
          <button className="btn btn-LIGHT text-white" onClick={handleLogin}>
            Login With Spotify
          </button>
          <button
            className="btn btn-dark"
            color="white"
            onClick={createPlaylistFromGenres}
          >
            Generate Playlist from Genres
          </button>
        </div>

        {playlistDetails && (
          <div
            className="card mt-5 mx-auto"
            style={{
              width: "100%",
              maxWidth: "350px", // Set a max width for the card
            }}
          >
            <img
              src={playlistDetails.image}
              className="card-img-top"
              alt="Playlist Art"
              style={{
                width: "100%", // Ensure the image scales properly
                height: "auto",
              }}
            />
            <div className="card-body">
              <h5 className="card-title">{playlistDetails.name}</h5>
              <a
                href={playlistDetails.link}
                className="btn btn-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Playlist on Spotify
              </a>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-dark"
                  onClick={regeneratePlaylist}
                  disabled={!playlistDetails}
                  style={{ display: playlistDetails ? "block" : "none" }}
                >
                  Regenerate Playlist
                </button>
              </div>
            </div>
          </div>
        )}
        {filteredTracks.length > 0 && (
          <div className="mt-4">
            <h2>Generated Tracks</h2>
            <ul className="list-group">
              {filteredTracks.map((track) => (
                <li key={track.uri} className="list-group-item">
                  {track.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
export default GeneratePlaylist;
