import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
  venueName: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Venue = mongoose.model('Venue', venueSchema);
export default Venue;