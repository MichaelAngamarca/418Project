import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [targetGenres, setTargetGenres] = useState("");
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [playlistDetails, setPlaylistDetails] = useState(null);

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
    }
  }, []);

  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  const extractPlaylistId = (url) => {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const createNewPlaylist = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const playlistId = extractPlaylistId(playlistLink);

    if (!accessToken || !playlistId || !targetGenres) {
      alert("Please login, provide a valid playlist link, and enter genres.");
      return;
    }

    try {
      // Fetch playlist tracks
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

      // Fetch genres for each artist
      const artistGenres = await Promise.all(
        tracks.map((track) =>
          fetch(`https://api.spotify.com/v1/artists/${track.artistId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }).then((res) => res.json())
        )
      );

      // Filter tracks by target genres
      const filtered = tracks.filter((track, i) =>
        artistGenres[i].genres.some((genre) =>
          targetGenres.split(",").map((g) => g.trim().toLowerCase()).includes(genre.toLowerCase())
        )
      );

      if (filtered.length === 0) {
        alert("No tracks match the specified genres.");
        return;
      }

      setFilteredTracks(filtered);

      // Create new playlist
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
            name: "Generated Playlist",
            description: "Playlist generated based on similar genres",
            public: false,
          }),
        }
      );

      const playlistData = await createPlaylistResponse.json();

      // Add tracks to the new playlist
      await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: filtered.map((track) => track.uri),
          }),
        }
      );

      // Fetch playlist details (name, cover image, and link)
      const playlistDetailsResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const playlistDetailsData = await playlistDetailsResponse.json();
      setPlaylistDetails({
        name: playlistDetailsData.name,
        image: playlistDetailsData.images[0]?.url,
        link: playlistDetailsData.external_urls.spotify,
      });

      alert("Playlist created successfully!");
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Generate Playlist</h1>
      <button className="btn btn-primary mb-4" onClick={handleLogin}>
        Login With Spotify
      </button>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter Spotify Playlist Link"
        value={playlistLink}
        onChange={(e) => setPlaylistLink(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter Target Genres (comma-separated)"
        value={targetGenres}
        onChange={(e) => setTargetGenres(e.target.value)}
      />
      <button className="btn btn-success" onClick={createNewPlaylist}>
        Create New Playlist
      </button>

      {playlistDetails && (
        <div className="card mt-4">
          <img src={playlistDetails.image} className="card-img-top" alt="Playlist Art" />
          <div className="card-body">
            <h5 className="card-title">{playlistDetails.name}</h5>
            <a href={playlistDetails.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Open Playlist on Spotify
            </a>
          </div>
        </div>
      )}

      {filteredTracks.length > 0 && (
        <div className="mt-4">
          <h2>Filtered Tracks</h2>
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
  );
};

export default GeneratePlaylist;
