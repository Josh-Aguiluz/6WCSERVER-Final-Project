//Josh Andrei Aguiluz
const mongoose = require('mongoose');

// Global database connection state
let isConnected = false;
let connectionAttempts = 0;
const maxConnectionAttempts = 3;

const connectDB = async () => {
  // Check if already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected!');
    return true;
  }

  // Check if MONGODB_URI is provided
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not provided. Running in demo mode.');
    console.log('📝 To enable full functionality, create a .env file with MONGODB_URI');
    return false;
  }

  try {
    connectionAttempts++;
    console.log(`🔄 Attempting to connect to MongoDB (attempt ${connectionAttempts}/${maxConnectionAttempts})...`);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });
    
    isConnected = true;
    connectionAttempts = 0;
    console.log('✅ MongoDB connected successfully!');
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected. Will attempt to reconnect...');
      isConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully!');
      isConnected = true;
    });
    
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection error (attempt ${connectionAttempts}):`, error.message);
    
    if (connectionAttempts >= maxConnectionAttempts) {
      console.error('🚨 Max connection attempts reached. Running in demo mode.');
      console.log('📝 Please check your MongoDB connection and restart the server.');
      return false;
    }
    
    // Wait before retrying
    console.log(`⏳ Waiting 5 seconds before retry...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    return connectDB(); // Recursive retry
  }
};

// Check if database is available
const isDatabaseAvailable = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

// Graceful shutdown
const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('👋 MongoDB connection closed.');
  }
};

module.exports = { connectDB, isDatabaseAvailable, disconnectDB };