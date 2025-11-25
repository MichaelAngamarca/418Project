import express from "express";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import querystring from "querystring";

const UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

const User = mongoose.model("User ", UserSchema);

const app = express();
const port = 5001;
var client_id = "7e8604cda2934a38874eeb19205ec10e";
var redirect_uri = "http://localhost:3000/";
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,DELETE,PUT",
    credentials: true,
  })
);
app.use(bodyParser.json());
const uri =
  "mongodb+srv://michaelangamarca558:ExO2757ZyIox49cA@cluster0.0qc4ag4.mongodb.net";
const client = new MongoClient(uri);

const JWT_SECRET = "your-jwt-secret";
client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.post("/usersignup", async (req, res) => {
  const { username, password } = req.body;
  console.log(`Recieved signup attempt: Username = ${username}`);
  try {
    const db = client.db("MainDB");
    const collection = db.collection("users");
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "UserName Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hashedPassword,
    };

    await collection.insertOne(newUser);

    res.status(201).json({ message: "User Created Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/userlogin", async (req, res) => {
  const { username, password } = req.body;
  console.log(`Recieved login attempt: Username = ${username}`);
  try {
    const db = client.db("MainDB");
    const collection = db.collection("users");

    const existingUser = await collection.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({
        message:
          "There is no account correlated to this username. Try again or Signup.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid Password. Please Try Again." });
    }

    const token = jwt.sign(
      { username: existingUser.username, userId: existingUser._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login Successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//************************** */

app.post("/uploadSong", async (req, res) => {
  const { songLink } = req.body;
  console.log(`Received song upload: Link = ${songLink}`);

  try {
    const db = client.db("MainDB");
    const collection = db.collection("songs");

    const existingSong = await collection.findOne({ songLink });
    if (existingSong) {
      return res.status(400).json({ message: "Song already exists in the database." });
    }

    await collection.insertOne({ songLink });
    res.status(201).json({ message: "Song uploaded successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

