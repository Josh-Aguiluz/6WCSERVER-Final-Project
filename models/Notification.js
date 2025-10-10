const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'quest_completed',
      'badge_earned',
      'level_up',
      'post_pinned',
      'quest_created',
      'user_joined',
      'partner_approved',
      'admin_approved',
      'submission_approved',
      'submission_rejected',
      'challenge_joined',
      'challenge_completed',
      'post_liked',
      'post_commented',
      'role_approved'
    ]
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  is_read: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);












