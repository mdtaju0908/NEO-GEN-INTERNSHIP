const express = require('express');
const router = express.Router();
const {
    getInternships,
    getInternshipById,
    createInternship,
    updateInternship,
    deleteInternship,
    getRecommendedInternships
} = require('../controllers/internshipController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getInternships).post(protect, admin, createInternship);
router.get('/recommended', protect, getRecommendedInternships);
router.route('/:id').get(getInternshipById).put(protect, admin, updateInternship).delete(protect, admin, deleteInternship);

module.exports = router;
