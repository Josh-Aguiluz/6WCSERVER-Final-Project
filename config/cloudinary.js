const cloudinary = require('cloudinary').v2;

// Debug logging
console.log('🔧 Loading Cloudinary configuration...');
console.log('CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? 'Set' : 'Not set');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');

// Check if any Cloudinary configuration is available
const hasCloudinaryConfig = process.env.CLOUDINARY_URL || 
  (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (!hasCloudinaryConfig) {
  console.error('❌ No Cloudinary configuration found! Please set CLOUDINARY_URL or individual environment variables.');
  console.error('Required variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

// Configure Cloudinary - prioritize CLOUDINARY_URL if available
if (process.env.CLOUDINARY_URL) {
  console.log('✅ Using CLOUDINARY_URL for configuration');
  cloudinary.config(process.env.CLOUDINARY_URL);
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  console.log('✅ Using individual environment variables');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
} else {
  console.error('❌ Incomplete Cloudinary configuration');
}

// Test Cloudinary connection
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection test successful');
    console.log('Cloud name:', result.cloud_name);
  })
  .catch(error => {
    console.error('❌ Cloudinary connection test failed:', error.message);
  });

console.log('✅ Cloudinary configuration loaded successfully');
module.exports = cloudinary;