const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Optional: reduce deprecation warnings
mongoose.set('strictQuery', true);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
  }

  let attempt = 0;
  while (true) {
    attempt += 1;
    try {
      await mongoose.connect(uri);
      console.log(`MongoDB Connected (attempt ${attempt})`);
      break; // success
    } catch (err) {
      console.error(`MongoDB connection failed (attempt ${attempt}): ${err.message}`);
      // In dev, keep retrying instead of exiting the process
      await delay(5000);
    }
  }
};

module.exports = connectDB;