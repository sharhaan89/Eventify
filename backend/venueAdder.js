import mongoose from "mongoose";
import Venue from "./models/Venue.js";

async function addVenue() {
  try {
    await mongoose.connect("mongodb+srv://prem:password1234@cluster0.d6dyzbl.mongodb.net/trail5"); // Await connection

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
