const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb+srv://abhaleparth07_db_user:diu5sLntxkBtRh8Y@cluster0.ufubbra.mongodb.net/shopnest?retryWrites=true&w=majority';
  const localUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/shopnest';

  // 1. Try Primary (Atlas) with a 6-second timeout
  try {
    console.log('Connecting to primary MongoDB (Atlas)...');
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 6000,
    });
    console.log(`✔ MongoDB Atlas connected successfully: ${conn.connection.host}`);
    return true;
  } catch (atlasErr) {
    console.warn(`✘ MongoDB Atlas connection failed (${atlasErr.message}).`);
    console.warn('  Note: If using Atlas, ensure your current IP is whitelisted in MongoDB Atlas Network Access.');
  }

  // 2. Try Local MongoDB with a 3-second timeout
  try {
    console.log('Attempting local MongoDB connection (127.0.0.1:27017)...');
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✔ Local MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (localErr) {
    console.warn(`✘ Local MongoDB connection failed (${localErr.message}).`);
  }

  // 3. Graceful fallback mode
  console.log('------------------------------------------------------------');
  console.log('ℹ Notice: Running in resilient fallback mode using local seed data.');
  console.log('  Products (200) and users (4) will be served reliably in-memory.');
  console.log('  To connect to live MongoDB, whitelist your IP on Atlas or run `mongod`.');
  console.log('------------------------------------------------------------');
  return false;
};

module.exports = connectDB;