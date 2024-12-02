import express from "express";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import querystring from "querystring";

function generateRandomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

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
  "mongodb+srv://michaelangamarca558:msab1205@cluster0.svhlz.mongodb.net/";
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

//For Spotify API Authroization
app.get("/login", function (req, res) {
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code", // Ensure this is 'code'
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (!state) {
    return res.redirect(
      "/#" +
        queryString.stringify({
          error: "state_mismatch",
        })
    );
  }

  try {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          client_id + ":" + client_secret
        ).toString("base64")}`,
      },
      data: new URLSearchParams({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      }),
    };

    const response = await axios(authOptions);
    const { access_token, refresh_token } = response.data;

    // Redirect or send a response with the tokens
    res.redirect(
      "/#" +
        queryString.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
        })
    );
  } catch (error) {
    console.error("Error during Spotify authorization callback:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
