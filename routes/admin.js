const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', auth, roleCheck('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ created_at: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/users/:id/role', auth, roleCheck('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'partner', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/approve
// @desc    Approve a partner/admin request
// @access  Private (Admin only)
router.put('/users/:id/approve', auth, roleCheck('admin'), async (req, res) => {
  try {
    console.log(`=== APPROVING USER: ${req.params.id} ===`);
    const user = await User.findById(req.params.id);
    
    if (!user) {
      console.log('User not found for approval');
      return res.status(404).json({ 
        success: false,
        msg: 'User not found' 
      });
    }

    console.log('User before approval:', {
      id: user._id,
      email: user.email,
      role: user.role,
      requested_role: user.requested_role,
      is_approved: user.is_approved
    });

    // If user has a requested_role, promote them to that role
    if (user.requested_role) {
      const previousRole = user.role;
      user.role = user.requested_role;
      user.requested_role = null;
      console.log(`Promoting user from ${previousRole} to ${user.role}`);
    }
    
    user.is_approved = true;
    await user.save();

    console.log('User after approval:', {
      id: user._id,
      email: user.email,
      role: user.role,
      requested_role: user.requested_role,
      is_approved: user.is_approved
    });

    // Create notification for role approval
    const notification = new Notification({
      user_id: user._id,
      type: 'role_approved',
      title: 'Role application approved!',
      message: `Your application to become a ${user.role} has been approved!`,
      data: {
        approvedRole: user.role,
        approvedBy: req.user.id,
        approvedByUsername: req.user.username
      }
    });
    await notification.save();

    const updatedUser = await User.findById(req.params.id).select('-password');
    res.json({
      success: true,
      msg: `User approved as ${updatedUser.role}`,
      user: updatedUser
    });
  } catch (err) {
    console.error('Approval error:', err.message);
    res.status(500).json({ 
      success: false,
      msg: 'Server error',
      error: err.message 
    });
  }
});

// @route   PUT /api/admin/users/:id/reject
// @desc    Reject a partner/admin request
// @access  Private (Admin only)
router.put('/users/:id/reject', auth, roleCheck('admin'), async (req, res) => {
  try {
    console.log(`=== REJECTING USER: ${req.params.id} ===`);
    const user = await User.findById(req.params.id);
    
    if (!user) {
      console.log('User not found for rejection');
      return res.status(404).json({ 
        success: false,
        msg: 'User not found' 
      });
    }

    console.log('User before rejection:', {
      id: user._id,
      email: user.email,
      role: user.role,
      requested_role: user.requested_role,
      is_approved: user.is_approved
    });

    const rejectedRole = user.requested_role;

    // Clear the requested role and set as regular approved user
    user.requested_role = null;
    user.role = 'user';
    user.is_approved = true;
    await user.save();

    console.log('User after rejection:', {
      id: user._id,
      email: user.email,
      role: user.role,
      requested_role: user.requested_role,
      is_approved: user.is_approved
    });

    const updatedUser = await User.findById(req.params.id).select('-password');
    res.json({
      success: true,
      msg: `${rejectedRole} request rejected. User remains as regular user.`,
      user: updatedUser
    });
  } catch (err) {
    console.error('Rejection error:', err.message);
    res.status(500).json({ 
      success: false,
      msg: 'Server error',
      error: err.message 
    });
  }
});

// @route   GET /api/admin/partner-requests
// @desc    Get all pending partner and admin requests
// @access  Private (Admin only)
router.get('/partner-requests', auth, roleCheck('admin'), async (req, res) => {
  try {
    // Find all users with pending role requests (have requested_role set and not approved)
    const pendingRequests = await User.find({ 
      requested_role: { $in: ['partner', 'admin'] },
      is_approved: false 
    })
      .select('-password')
      .sort({ created_at: -1 });
    res.json(pendingRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private (Admin only)
router.delete('/users/:id', auth, roleCheck('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

