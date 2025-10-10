//Josh Andrei Aguiluz
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');
const cloudinary = require('./config/cloudinary');

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  // Only log non-health check requests
  if (req.path !== '/api/health' && req.path !== '/api/auth/me') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body:', req.body);
    }
  }
  next();
});

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`📁 Created directory: ${uploadsDir}`);
}

// Serve uploaded files statically from uploads directory
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  }
}));

// Define Routes with error handling
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/quests', require('./routes/quests'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/posts', require('./routes/posts'));
  app.use('/api/daily', require('./routes/daily'));
  app.use('/api/badges', require('./routes/badges'));
  app.use('/api/challenges', require('./routes/challenges'));
  app.use('/api/dashboard', require('./routes/dashboard'));
  app.use('/api/notifications', require('./routes/notifications').router);
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error);
}

// Health check route
app.get('/api/health', (req, res) => {
  const uploadsExists = fs.existsSync(uploadsDir);
  const uploadsFiles = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir).length : 0;

  res.json({
    status: 'ok',
    message: 'HAU Eco-Quest API is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    uploads: {
      directory: uploadsDir,
      exists: uploadsExists,
      fileCount: uploadsFiles
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    msg: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    msg: 'Route not found',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
});