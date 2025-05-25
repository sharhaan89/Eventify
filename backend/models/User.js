import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Student', 'Manager'],
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: false
  },
  branch: {
    type: String,
    enum: ['CSE', 'MECH', 'CHEM', 'CIVIL', 'ECE', 'EEE', 'IT', 'MACS', 'META', 'MINING', 'PHY'],
    required: false
  },
  yog: {
    type: Number, // Year of Graduation 
    required: false
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
