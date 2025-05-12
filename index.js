import express from 'express';
import mongoose from 'mongoose';
import { Log } from './models/logs.js';
import { Signupdata } from "./models/signupdata.js";
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect("mongodb://localhost:27017/Logs")
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.post('/add-logs', async (req, res) => {
  const { Room, fromTime, toTime } = req.body;

  // Check for overlapping bookings in the same room
  const conflictingLog = await Log.findOne({
    Room,
    fromTime: { $lt: new Date(toTime) },
    toTime: { $gt: new Date(fromTime) }
  });

  if (conflictingLog) {
    return res.status(409).send('Room is already booked during the requested time period.');
  }

  const log = new Log(req.body);
  await log.save();
  res.status(200).send('Log added successfully!');
});

//CONNECTING FRONTEND
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"signup.html"))
})


//TO POST THE SIGN UP DETAILS
app.post("/signup", async (req, res) => {
  const { username, email, password, confirmation } = req.body;

    if (password !== confirmation) {
    return res.status(400).send("Passwords do not match.");
  }

  const existingUser = await Signupdata.findOne({ username });
  if (existingUser) {
    return res.status(409).send("USER NAME ALREADY EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

    const sudata = new Signupdata({
    username,
    email,
    password: hashedPassword
  });

  await sudata.save();
  console.log(sudata);
  res.status(200).send("SIGN UP CREDENTIALS ADDED TO DB");
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
