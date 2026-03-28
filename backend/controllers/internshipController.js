const asyncHandler = require('express-async-handler');
const Internship = require('../models/Internship');
const User = require('../models/User');
const Resume = require('../models/Resume');

// @desc    Get recommended internships based on user profile/resume
// @route   GET /api/internships/recommended
// @access  Private
const getRecommendedInternships = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const resume = await Resume.findOne({ user: req.user.id }).sort({ createdAt: -1 });

    let userSkills = user.skills || [];
    
    // Merge skills from resume if available to improve recommendation
    if (resume && resume.extractedSkills) {
        // Simple deduplication
        const skillSet = new Set(userSkills.map(s => s.toLowerCase()));
        resume.extractedSkills.forEach(s => {
            if (!skillSet.has(s.toLowerCase())) {
                userSkills.push(s);
            }
        });
    }

    // Normalize user skills to lowercase for comparison
    const normalizedUserSkills = userSkills.map(s => s.toLowerCase());

    // Get all active internships
    const internships = await Internship.find({ status: 'active' }).lean();

    // Calculate score for each internship
    const scoredInternships = internships.map(internship => {
        let score = 0;
        let matchedSkills = [];

        // 1. Skill Matching (Highest Weight)
        // Check if internship required skills match user skills
        if (internship.skills && Array.isArray(internship.skills)) {
             internship.skills.forEach(skill => {
                const skillLower = skill.toLowerCase();
                // Check for partial matches (e.g., "React" matches "React.js")
                const isMatch = normalizedUserSkills.some(userSkill => 
                    userSkill.includes(skillLower) || skillLower.includes(userSkill)
                );
                
                if (isMatch) {
                    score += 10;
                    matchedSkills.push(skill);
                }
             });
        }

        // 2. Location Matching
        if (user.preferredLocation && internship.location && 
            (internship.location.toLowerCase().includes(user.preferredLocation.toLowerCase()) || 
             user.preferredLocation.toLowerCase().includes(internship.location.toLowerCase()) ||
             internship.location.toLowerCase() === 'remote')) {
            score += 5;
        }
        
        // 3. Title/Department Relevance
        if (user.course) {
             const courseLower = user.course.toLowerCase();
             if (internship.title.toLowerCase().includes(courseLower) || 
                 internship.department.toLowerCase().includes(courseLower)) {
                 score += 5;
             }
        }

        return { 
            ...internship, 
            matchScore: score, 
            matchedSkills,
            matchPercentage: Math.min(100, Math.round((score / 30) * 100)) // Approximate percentage
        };
    });

    // Sort by score descending
    scoredInternships.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(scoredInternships);
});

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
const getInternships = asyncHandler(async (req, res) => {
    const internships = await Internship.find({ status: 'active' }).lean();
    res.status(200).json(internships);
});

// @desc    Get single internship by ID
// @route   GET /api/internships/:id
// @access  Public
const getInternshipById = asyncHandler(async (req, res) => {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
        res.status(404);
        throw new Error('Internship not found');
    }

    res.status(200).json(internship);
});

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private/Admin
const createInternship = asyncHandler(async (req, res) => {
    req.body.createdBy = req.user.id;
    const internship = await Internship.create(req.body);
    res.status(201).json(internship);
});

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private/Admin
const updateInternship = asyncHandler(async (req, res) => {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
        res.status(404);
        throw new Error('Internship not found');
    }

    const updatedInternship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedInternship);
});

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private/Admin
const deleteInternship = asyncHandler(async (req, res) => {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
        res.status(404);
        throw new Error('Internship not found');
    }

    await internship.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getInternships,
    getInternshipById,
    createInternship,
    updateInternship,
    deleteInternship,
    getRecommendedInternships
};
