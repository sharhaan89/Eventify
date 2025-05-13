const mongoose = require('mongoose');

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

module.exports = mongoose.model('Venue', venueSchema);
