// server/config/db.js
// Handles the MongoDB connection using Mongoose.
// Kept separate so server.js stays clean and this logic can be reused
// (e.g. by the seed script).

const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    // Fail fast and loudly if the developer forgot to set up their .env file.
    console.error('MONGO_URI is not defined. Did you create server/.env from .env.example?');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
