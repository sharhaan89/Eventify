import mongoose from 'mongoose';
const signupschema =new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:String,
    password:String,
    confirmation:String
})

export const Signupdata =mongoose.model("Signupdata",signupschema)