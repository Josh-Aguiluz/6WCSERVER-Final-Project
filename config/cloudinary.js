const cloudinary = require('cloudinary').v2;

<<<<<<< HEAD
=======

>>>>>>> notifs_josh
// Debug logging
console.log('🔧 Loading Cloudinary configuration...');
console.log('CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? 'Set' : 'Not set');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set');

<<<<<<< HEAD
=======

>>>>>>> notifs_josh
// Configure Cloudinary - prioritize CLOUDINARY_URL if available
if (process.env.CLOUDINARY_URL) {
  console.log('✅ Using CLOUDINARY_URL for configuration');
  cloudinary.config(process.env.CLOUDINARY_URL);
} else {
  console.log('⚠️ Using individual environment variables');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

<<<<<<< HEAD
console.log('✅ Cloudinary configuration loaded successfully');
module.exports = cloudinary;
=======

console.log('✅ Cloudinary configuration loaded successfully');
module.exports = cloudinary;





>>>>>>> notifs_josh
