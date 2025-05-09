import express from 'express';
import mongoose from 'mongoose';
import { Log } from './models/logs.js';

mongoose.connect("mongodb://localhost:27017/Logs")
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

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


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
