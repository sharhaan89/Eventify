import mongoose from 'mongoose';
const signupschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    password: String,
    confirmation: String,
    role: {
        type: String,
        enum: ["Manager", "Student"], default: "Student"
    }
})

export const Signupdata = mongoose.model("Signupdata", signupschema)