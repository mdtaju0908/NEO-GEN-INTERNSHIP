const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Public
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ active: true }).sort({ createdAt: -1 });
    res.json(notifications);
});

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
    const { title, message, type, priority, link, active } = req.body;

    const notification = new Notification({
        title,
        message,
        type,
        priority,
        link,
        active
    });

    const createdNotification = await notification.save();
    res.status(201).json(createdNotification);
});

// @desc    Update a notification
// @route   PUT /api/notifications/:id
// @access  Private/Admin
const updateNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        notification.title = req.body.title || notification.title;
        notification.message = req.body.message || notification.message;
        notification.type = req.body.type || notification.type;
        notification.priority = req.body.priority || notification.priority;
        notification.link = req.body.link || notification.link;
        notification.active = req.body.active !== undefined ? req.body.active : notification.active;

        const updatedNotification = await notification.save();
        res.json(updatedNotification);
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        await notification.deleteOne();
        res.json({ message: 'Notification removed' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

module.exports = {
    getNotifications,
    createNotification,
    updateNotification,
    deleteNotification
};
