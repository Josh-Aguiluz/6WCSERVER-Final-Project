const sharp = require('sharp');

<<<<<<< HEAD
=======

>>>>>>> notifs_josh
/**
 * Compress and optimize image for web
 * @param {Buffer} imageBuffer - The image buffer to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Buffer>} - Compressed image buffer
 */
const compressImage = async (imageBuffer, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 85,
    format = 'jpeg'
  } = options;

<<<<<<< HEAD
  try {
    let sharpInstance = sharp(imageBuffer);

    // Get image metadata
    const metadata = await sharpInstance.metadata();
    
=======

  try {
    let sharpInstance = sharp(imageBuffer);


    // Get image metadata
    const metadata = await sharpInstance.metadata();
   
>>>>>>> notifs_josh
    // Resize if image is larger than max dimensions
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

<<<<<<< HEAD
=======

>>>>>>> notifs_josh
    // Apply compression based on format
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        return await sharpInstance
<<<<<<< HEAD
          .jpeg({ 
=======
          .jpeg({
>>>>>>> notifs_josh
            quality,
            progressive: true,
            mozjpeg: true
          })
          .toBuffer();
<<<<<<< HEAD
      
      case 'png':
        return await sharpInstance
          .png({ 
=======
     
      case 'png':
        return await sharpInstance
          .png({
>>>>>>> notifs_josh
            quality,
            progressive: true,
            compressionLevel: 9
          })
          .toBuffer();
<<<<<<< HEAD
      
      case 'webp':
        return await sharpInstance
          .webp({ 
=======
     
      case 'webp':
        return await sharpInstance
          .webp({
>>>>>>> notifs_josh
            quality,
            effort: 6
          })
          .toBuffer();
<<<<<<< HEAD
      
      default:
        // Default to JPEG
        return await sharpInstance
          .jpeg({ 
=======
     
      default:
        // Default to JPEG
        return await sharpInstance
          .jpeg({
>>>>>>> notifs_josh
            quality,
            progressive: true,
            mozjpeg: true
          })
          .toBuffer();
    }
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error('Failed to compress image');
  }
};

<<<<<<< HEAD
=======

>>>>>>> notifs_josh
/**
 * Get optimized image format based on original format
 * @param {string} originalFormat - Original image format
 * @returns {string} - Optimized format
 */
const getOptimizedFormat = (originalFormat) => {
  const format = originalFormat?.toLowerCase();
<<<<<<< HEAD
  
=======
 
>>>>>>> notifs_josh
  // Convert to WebP for better compression, fallback to JPEG
  if (format === 'png' || format === 'jpeg' || format === 'jpg') {
    return 'webp';
  }
<<<<<<< HEAD
  
  return 'jpeg';
};

=======
 
  return 'jpeg';
};


>>>>>>> notifs_josh
/**
 * Compress image with smart format selection
 * @param {Buffer} imageBuffer - The image buffer to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Object>} - { buffer: Buffer, format: string }
 */
const smartCompressImage = async (imageBuffer, options = {}) => {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    const optimizedFormat = getOptimizedFormat(metadata.format);
<<<<<<< HEAD
    
=======
   
>>>>>>> notifs_josh
    const compressedBuffer = await compressImage(imageBuffer, {
      ...options,
      format: optimizedFormat
    });

<<<<<<< HEAD
=======

>>>>>>> notifs_josh
    return {
      buffer: compressedBuffer,
      format: optimizedFormat,
      originalSize: imageBuffer.length,
      compressedSize: compressedBuffer.length,
      compressionRatio: Math.round((1 - compressedBuffer.length / imageBuffer.length) * 100)
    };
  } catch (error) {
    console.error('Smart compression error:', error);
    throw new Error('Failed to compress image');
  }
};

<<<<<<< HEAD
=======

>>>>>>> notifs_josh
module.exports = {
  compressImage,
  smartCompressImage,
  getOptimizedFormat
};
<<<<<<< HEAD
=======





>>>>>>> notifs_josh
