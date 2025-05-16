import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import { error } from 'console';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://prem:password1234@cluster0.d6dyzbl.mongodb.net/trail5")
.then(()=>{
  console.log("DB is connected")
})
.catch((error)=>{
  console.log("DB is not connected",error)
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Routes
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/events", registrationRoutes);

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "signup.html"));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
