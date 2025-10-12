// Database availability middleware
const { isDatabaseAvailable } = require('../db');

// Middleware to check database availability
const checkDatabase = (req, res, next) => {
  if (!isDatabaseAvailable()) {
    return res.status(503).json({
      success: false,
      message: 'Database temporarily unavailable. Please try again later.',
      demoMode: true
    });
  }
  next();
};

// Middleware for demo mode responses
const demoModeResponse = (req, res, next) => {
  if (!isDatabaseAvailable()) {
    // Return demo data for specific endpoints
    if (req.path.includes('/quests') && req.method === 'GET') {
      return res.json([
        {
          _id: 'demo-quest-1',
          title: 'Campus Recycling Program',
          description: 'Join our campus recycling initiative and help reduce waste.',
          points: 50,
          category: 'Environmental',
          status: 'active',
          demo: true
        },
        {
          _id: 'demo-quest-2', 
          title: 'Water Conservation Challenge',
          description: 'Learn about water conservation and implement sustainable practices.',
          points: 30,
          category: 'Conservation',
          status: 'active',
          demo: true
        }
      ]);
    }
    
    if (req.path.includes('/posts') && req.method === 'GET') {
      return res.json([
        {
          _id: 'demo-post-1',
          title: 'Welcome to HAU Eco-Quest!',
          content: 'This is a demo post. Connect to database for full functionality.',
          author: { username: 'Demo User', department: 'Environmental Science' },
          createdAt: new Date(),
          likes: 5,
          comments: 2,
          demo: true
        }
      ]);
    }
    
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Running in demo mode.',
      demoMode: true
    });
  }
  next();
};

module.exports = { checkDatabase, demoModeResponse };
