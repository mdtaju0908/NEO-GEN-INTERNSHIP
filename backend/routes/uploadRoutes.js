const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload a file');
        }
        res.status(200).json({
            message: 'File uploaded successfully',
            filePath: req.file.path, // Cloudinary URL
            fileName: req.file.originalname
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
