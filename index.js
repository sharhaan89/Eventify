import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { Signupdata } from "./models/signupdata.js";
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect("mongodb://localhost:27017/Logs")
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//Routes
app.use("/users", userRoutes);

app.use(express.static(path.join(__dirname, "Eventify Front End")));

//CONNECTING FRONTEND
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Eventify Front End", "signup.html"));
})


//TO POST THE SIGN UP DETAILS
app.post("/signup", async (req, res) => {
  const { username, email, password, confirmation, role } = req.body;
  //CHECKING PASSWORD AND CONFIRM PASSWORD
  if (password !== confirmation) {
    return res.status(400).send("Passwords do not match.");
  }
  //CHECKING MAIL EXISTANCE
  const existingemail = await Signupdata.findOne({ email });
  if (existingemail) {
    return res.status(409).send("EMAIL ALREADY EXISTS");
  }
  //CHECKING USERNAME EXISTANCE
  const existingUser = await Signupdata.findOne({ username });
  if (existingUser) {
    return res.status(409).send("USER NAME ALREADY EXISTS");
  }
  //HASHING THE PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);
  const sudata = new Signupdata({
    username,
    email,
    password: hashedPassword,
    role
  });

  await sudata.save();
  console.log(sudata);
  res.status(200).send("SIGN UP CREDENTIALS ADDED TO DB");
});


//LOG IN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Signupdata.findOne({ email });
    if (!user) {
      return res.status(404).send("USER NOT FOUND");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send("Incorrect password.");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal server error.");
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
