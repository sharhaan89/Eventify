import mongoose from "mongoose";
import Venue from "../models/Venue.js";

async function addVenue() {
  try {
    await mongoose.connect("mongodb+srv://sksharhaannaim89:DqKpP1wv7Y5M9QbD@logs.ltjibis.mongodb.net/Logs?retryWrites=true&w=majority&appName=Logs"); // Await connection

    const newVenue = new Venue({
      venueName: "Silver Jubilee Auditorium",
      capacity: 800
    });

    const savedVenue = await newVenue.save();
    console.log("Venue saved:", savedVenue);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error saving venue:", error);
  }
}

addVenue();
