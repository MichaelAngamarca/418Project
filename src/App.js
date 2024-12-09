import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Homepage from "./HomePage/Homepage";
import Login from "./Login/Login";
import GeneratePlaylist from "./GeneratePlaylist/GeneratePlaylist";
import About from "./About/About";
import Signup from "./Signup/Signup";
import Spotifylogin from "./SpotifyLogin/Spotifylogin";
import UploadSong from "./UploadSong/UploadSong";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/generateplaylist" element={<GeneratePlaylist />} />
        <Route path="/howtouse" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/spotifylogin" element={<Spotifylogin />} />
        <Route path="/uploadsong" element={<UploadSong />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
