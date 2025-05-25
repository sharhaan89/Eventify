import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import cookieParser from "cookie-parser";
import { error } from 'console';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

//change to global database later
mongoose.connect("mongodb://127.0.0.1:27017/Logs")
.then(()=>{ 
  console.log("DB is connected")
})
.catch((error)=>{
  console.log("DB is not connected",error)
})

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",  // 👈 exact frontend origin
  credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/events', registrationRoutes);

//app.use('/', qrCodeRoute);

/*
// Serve static files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});
*/

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
