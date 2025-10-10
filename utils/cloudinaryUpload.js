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
    // Compress image before upload
    const compressionResult = await smartCompressImage(file.buffer, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 85
    });

    console.log(`Image compressed: ${compressionResult.originalSize} -> ${compressionResult.compressedSize} bytes (${compressionResult.compressionRatio}% reduction)`);

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
          if (error) reject(error);
          else resolve(result);
        }
      );

      bufferToStream(compressionResult.buffer).pipe(uploadStream);
    });

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
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
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
