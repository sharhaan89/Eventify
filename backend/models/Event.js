import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  banner: {
    data: Buffer,
    contentType: String
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: true
  },
  fromTime: {
    type: Date,
    required: true
  },
  toTime: {
    type: Date,
    required: true
  },
  createdBy: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  club: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;
