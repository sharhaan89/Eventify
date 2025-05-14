import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/Logs", {
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend'));

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// Routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/events', registrationRoutes);

// Root route → render signup page
app.get('/', (req, res) => {
  res.render('users/signup'); // corresponds to /frontend/auth/signup.ejs
});

// 404 fallback
app.use((req, res) => {
  res.status(404).render('errors/404'); // frontend/errors/404.ejs
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
