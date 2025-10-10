const sharp = require('sharp');

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

  try {
    let sharpInstance = sharp(imageBuffer);

    // Get image metadata
    const metadata = await sharpInstance.metadata();
   
    // Resize if image is larger than max dimensions
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Apply compression based on format
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        return await sharpInstance
          .jpeg({
            quality,
            progressive: true,
            mozjpeg: true
          })
          .toBuffer();
     
      case 'png':
        return await sharpInstance
          .png({
            quality,
            progressive: true,
            compressionLevel: 9
          })
          .toBuffer();
     
      case 'webp':
        return await sharpInstance
          .webp({
            quality,
            effort: 6
          })
          .toBuffer();
     
      default:
        // Default to JPEG
        return await sharpInstance
          .jpeg({
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

/**
 * Get optimized image format based on original format
 * @param {string} originalFormat - Original image format
 * @returns {string} - Optimized format
 */
const getOptimizedFormat = (originalFormat) => {
  const format = originalFormat?.toLowerCase();
 
  // Convert to WebP for better compression, fallback to JPEG
  if (format === 'png' || format === 'jpeg' || format === 'jpg') {
    return 'webp';
  }
 
  return 'jpeg';
};

/**
 * Compress image with smart format selection
 * @param {Buffer} imageBuffer - The image buffer to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Object>} - Compression result with metadata
 */
const smartCompressImage = async (imageBuffer, options = {}) => {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    const optimizedFormat = getOptimizedFormat(metadata.format);
   
    const compressedBuffer = await compressImage(imageBuffer, {
      ...options,
      format: optimizedFormat
    });

    return {
      buffer: compressedBuffer,
      format: optimizedFormat,
      originalSize: imageBuffer.length,
      compressedSize: compressedBuffer.length,
      compressionRatio: Math.round(((imageBuffer.length - compressedBuffer.length) / imageBuffer.length) * 100)
    };
  } catch (error) {
    console.error('Smart compression error:', error);
    throw new Error('Failed to compress image');
  }
};

module.exports = {
  compressImage,
  smartCompressImage,
  getOptimizedFormat
};