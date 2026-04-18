const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const ActivityLog = require('../models/ActivityLog');
const jwt = require('jsonwebtoken');

// @desc    Get all users (Dashboard God Mode)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Change user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('User not found');
    user.role = role;
    await user.save();

    await ActivityLog.create({
        user: req.user._id,
        action: 'UPDATE_ROLE',
        details: { targetUserId: user._id, newRole: role }
    });

    res.status(200).json({ success: true, data: user });
});

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('User not found');
    user.isBlocked = !user.isBlocked;
    await user.save();

    await ActivityLog.create({
        user: req.user._id,
        action: user.isBlocked ? 'BLOCK_USER' : 'UNBLOCK_USER',
        details: { targetUserId: user._id }
    });

    res.status(200).json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}` });
});

// @desc    Approve/Reject Partner
// @route   PUT /api/admin/partners/:id/status
// @access  Private/Admin
const updatePartnerStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('User not found');
    user.partnerStatus = status;
    await user.save();

    await ActivityLog.create({
        user: req.user._id,
        action: 'UPDATE_PARTNER_STATUS',
        details: { targetUserId: user._id, status }
    });

    res.status(200).json({ success: true, data: user });
});

// @desc    Get system Analytics (Graphs)
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getSystemAnalytics = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalInternships = await Internship.countDocuments();
    const totalApplications = await Application.countDocuments();
    
    // Aggregate users by role
    const usersByRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
        success: true,
        data: { totalUsers, totalInternships, totalApplications, usersByRole }
    });
});

// @desc    Impersonate a User
// @route   POST /api/admin/impersonate/:id
// @access  Private/Admin
const impersonateUser = asyncHandler(async (req, res) => {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) throw new Error('User not found');

    targetUser.impersonationActive = true;
    await targetUser.save();

    await ActivityLog.create({
        user: req.user._id,
        action: 'IMPERSONATE_USER',
        details: { targetUserId: targetUser._id, targetEmail: targetUser.email },
        ip: req.ip
    });

    const token = jwt.sign({ id: targetUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
        success: true, 
        message: `Impersonating ${targetUser.email}`,
        token,
        user: { _id: targetUser._id, name: targetUser.name, role: targetUser.role }
    });
});

// @desc    Get Admin Audit Logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getAuditLogs = asyncHandler(async (req, res) => {
    const logs = await ActivityLog.find({}).populate('user', 'name email').sort('-createdAt').limit(100);
    res.status(200).json({ success: true, data: logs });
});

module.exports = { 
    getUsers, 
    updateUserRole, 
    toggleBlockUser, 
    updatePartnerStatus, 
    getSystemAnalytics,
    impersonateUser,
    getAuditLogs
};
