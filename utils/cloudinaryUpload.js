const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');
const { smartCompressImage } = require('./imageCompression');

// Convert buffer to stream for Cloudinary
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Upload image to Cloudinary with compression
const uploadToCloudinary = async (file, folder = 'hau-eco-quest') => {
  try {
    console.log(`🚀 Starting Cloudinary upload for folder: ${folder}`);
    console.log(`📁 File info: ${file.originalname}, ${file.mimetype}, ${file.size} bytes`);
    
    // Check if file buffer exists
    if (!file.buffer) {
      throw new Error('File buffer is missing');
    }

    // Compress image before upload
    const compressionResult = await smartCompressImage(file.buffer, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 85
    });

    console.log(`📊 Image compressed: ${compressionResult.originalSize} -> ${compressionResult.compressedSize} bytes (${compressionResult.compressionRatio}% reduction)`);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload stream error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful:', result.public_id);
            resolve(result);
          }
        }
      );

      bufferToStream(compressionResult.buffer).pipe(uploadStream);
    });

    console.log(`🎉 Upload completed successfully: ${result.secure_url}`);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      compression: {
        originalSize: compressionResult.originalSize,
        compressedSize: compressionResult.compressedSize,
        compressionRatio: compressionResult.compressionRatio,
        format: compressionResult.format
      }
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      folder: folder,
      fileName: file?.originalname
    });
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const publicId = filename.split('.')[0];
  return `hau-eco-quest/${publicId}`;
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId
};