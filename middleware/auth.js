//Josh Andrei Aguiluz
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      msg: 'No token, authorization denied' 
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    
    // Get user role for authorization
    const user = await User.findById(req.user.id).select('username role requested_role is_approved');
    if (user) {
      req.user.username = user.username;
      req.user.role = user.role;
      req.user.requested_role = user.requested_role;
      req.user.is_approved = user.is_approved;
    } else {
      return res.status(401).json({ 
        success: false,
        msg: 'User not found' 
      });
    }
    
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      msg: 'Token is not valid',
      error: err.message 
    });
  }
};