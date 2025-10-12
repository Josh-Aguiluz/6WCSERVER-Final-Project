// Security configuration for HAU Eco-Quest
const securityConfig = {
  // Environment variables that should never be exposed
  sensitiveEnvVars: [
    'MONGODB_URI',
    'JWT_SECRET', 
    'CLOUDINARY_API_SECRET',
    'EMAIL_PASS'
  ],
  
  // Allowed origins for CORS
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  
  // Security headers
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  }
};

// Function to sanitize environment variables from logs
const sanitizeEnvForLogs = (envObj) => {
  const sanitized = { ...envObj };
  securityConfig.sensitiveEnvVars.forEach(key => {
    if (sanitized[key]) {
      sanitized[key] = '***HIDDEN***';
    }
  });
  return sanitized;
};

// Function to check if environment variables are properly set
const validateEnvironment = () => {
  const warnings = [];
  const errors = [];
  
  // Check for required variables
  if (!process.env.MONGODB_URI) {
    warnings.push('MONGODB_URI not set - running in demo mode');
  }
  
  if (!process.env.JWT_SECRET) {
    errors.push('JWT_SECRET is required for authentication');
  }
  
  // Check for weak JWT secret
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long for security');
  }
  
  return { warnings, errors };
};

module.exports = {
  securityConfig,
  sanitizeEnvForLogs,
  validateEnvironment
};
