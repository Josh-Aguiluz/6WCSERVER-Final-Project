const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadToCloudinary, deleteFromCloudinary, extractPublicId } = require('../utils/cloudinaryUpload');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for memory storage (for Cloudinary uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for Cloudinary
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ msg: 'File too large. Maximum size is 5MB.' });
    }
  } else if (err.message === 'Only images are allowed!') {
    return res.status(400).json({ msg: 'Only images are allowed!' });
  }
  next(err);
};

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    const filter = category ? { category } : {};

    const posts = await Post.find(filter)
      .populate('author', 'username role')
      .sort({ created_at: -1 })
      .limit(parseInt(limit));

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username role avatar_theme')
      .populate('comments.user', 'username avatar_theme');

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post (All users can post)
// @access  Private
router.post('/', auth, upload.single('image'), handleUploadError, async (req, res) => {
  try {
    // Handle multer errors
    if (req.fileValidationError) {
      return res.status(400).json({ msg: req.fileValidationError });
    }

    const { title, content, category, tags, image_url } = req.body;

    // Handle tags - they might come as string or array
    let processedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          processedTags = JSON.parse(tags);
        } catch (e) {
          processedTags = tags.split(',').map(t => t.trim()).filter(t => t);
        }
      } else if (Array.isArray(tags)) {
        processedTags = tags;
      }
    }

    let imageUrl = null;
    if (req.file) {
      try {
        const cloudinaryResult = await uploadToCloudinary(req.file, 'hau-eco-quest/posts');
        imageUrl = cloudinaryResult.secure_url;
        console.log(`Post image uploaded to Cloudinary: ${cloudinaryResult.compression.compressionRatio}% compression achieved`);
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ msg: 'Failed to upload image' });
      }
    } else if (image_url) {
      imageUrl = image_url;
    }

    const post = new Post({
      title,
      content,
      category: category || 'Updates',
      author: req.user.id,
      tags: processedTags,
      image_url: imageUrl
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username role');

    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (Author or Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update this post' });
    }

    const { title, content, category, tags, image_url } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    if (image_url !== undefined) post.image_url = image_url || null;
    post.updated_at = Date.now();

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username role');

    res.json(updatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (Author or Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this post' });
    }

    // Delete image from Cloudinary if it exists
    if (post.image_url) {
      try {
        const publicId = extractPublicId(post.image_url);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue with post deletion even if image deletion fails
      }
    }

    // Log deletion reason if provided (for admin deletions)
    if (req.body.reason && req.user.role === 'admin') {
      console.log(`Post ${req.params.id} deleted by admin ${req.user.id}. Reason: ${req.body.reason}`);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/Unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if already liked
    const likeIndex = post.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ msg: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    post.comments.push({
      user: req.user.id,
      text
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username role')
      .populate('comments.user', 'username avatar_theme');

    res.json(updatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/posts/:id/pin
// @desc    Pin/unpin a post (Admin only)
// @access  Private (Admin only)
router.put('/:id/pin', [auth, roleCheck('admin')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Toggle pin status
    post.isPinned = !post.isPinned;
    post.pinnedBy = post.isPinned ? req.user.id : null;
    post.pinnedAt = post.isPinned ? new Date() : null;

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username role')
      .populate('pinnedBy', 'username');

    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

