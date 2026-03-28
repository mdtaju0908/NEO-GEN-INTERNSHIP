const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const cloudinary = require('../config/cloudinary');
const { validateProfileData, sanitizeInput } = require('../utils/validation');

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture,
      university: user.university,
      course: user.course,
      skills: user.skills,
      experience: user.experience,
      projects: user.projects,
      resume: user.resume,
      profileCompletionPercentage: user.profileCompletionPercentage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/profile/update
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  // Validate input data
  const validation = validateProfileData(req.body);
  if (!validation.isValid) {
    res.status(400);
    throw new Error(validation.errors.join(', '));
  }

  const user = await User.findById(req.user.id);

  if (user) {
    // Sanitize inputs
    if (req.body.name) user.name = sanitizeInput(req.body.name);
    if (req.body.phone !== undefined) {
      // Allow empty phone number, only sanitize if provided
      user.phone = req.body.phone && req.body.phone.trim() ? sanitizeInput(req.body.phone) : '';
    }
    if (req.body.university) user.university = sanitizeInput(req.body.university);
    if (req.body.course) user.course = sanitizeInput(req.body.course);
    if (req.body.preferredLocation) user.preferredLocation = sanitizeInput(req.body.preferredLocation);
    
    if (req.body.skills) {
      user.skills = Array.isArray(req.body.skills) 
        ? req.body.skills.map(skill => sanitizeInput(skill))
        : user.skills;
    }
    
    if (req.body.experience) user.experience = req.body.experience;
    if (req.body.projects) user.projects = req.body.projects;
    if (req.body.resume) user.resume = req.body.resume;

    const updatedUser = await user.save();

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'Updated Profile',
      details: { updatedFields: Object.keys(req.body) },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      university: updatedUser.university,
      course: updatedUser.course,
      preferredLocation: updatedUser.preferredLocation,
      skills: updatedUser.skills,
      experience: updatedUser.experience,
      projects: updatedUser.projects,
      resume: updatedUser.resume,
      profileCompletionPercentage: updatedUser.profileCompletionPercentage,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Upload profile picture
// @route   POST /api/profile/upload-picture
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    // Fail fast if Cloudinary is not configured (common when .env uses placeholders)
    const requiredEnv = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    const missingEnv = requiredEnv.filter((key) => {
      const val = process.env[key];
      return !val || val.toLowerCase().includes('your_');
    });

    if (missingEnv.length) {
      res.status(500);
      throw new Error(`Cloudinary is not configured. Set ${missingEnv.join(', ')} in backend/.env with your actual Cloudinary credentials.`);
    }

    console.log('[Profile] Uploading profile picture to Cloudinary (via middleware)...');

    // With multer-storage-cloudinary, the file is already uploaded
    // req.file.path contains the Cloudinary URL
    const resultUrl = req.file.path;

    console.log('[Profile] ✅ Upload successful:', resultUrl);

    // Update user profile with new picture URL
    const user = await User.findById(req.user.id);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Delete old image from Cloudinary if exists
    if (user.profilePicture) {
      try {
        // Extract public_id from URL
        // Example: https://res.cloudinary.com/cloudname/image/upload/v1234/neo-gen/profile-pictures/filename.jpg
        const urlParts = user.profilePicture.split('/');
        const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
        if (versionIndex !== -1) {
            const publicIdWithExt = urlParts.slice(versionIndex + 1).join('/');
            const publicId = publicIdWithExt.split('.')[0]; // Remove extension
             await cloudinary.uploader.destroy(publicId);
             console.log('[Profile] Old image deleted from Cloudinary');
        }
      } catch (err) {
        console.log('[Profile] Could not delete old image:', err.message);
      }
    }

    user.profilePicture = resultUrl;
    await user.save();

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'Updated Profile Picture',
      details: { imageUrl: resultUrl },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture: resultUrl,
      profileCompletionPercentage: user.profileCompletionPercentage
    });

  } catch (error) {
    console.error('[Profile] Upload error:', error);
    res.status(500);
    throw new Error(`Failed to upload profile picture: ${error.message}`);
  }
});

// @desc    Delete profile picture
// @route   DELETE /api/profile/delete-picture
// @access  Private
const deleteProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!user.profilePicture) {
    res.status(400);
    throw new Error('No profile picture to delete');
  }

  // Delete from Cloudinary
  try {
    const publicId = user.profilePicture.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(`neo-gen/profile-pictures/${publicId.split('/')[1]}`);
    console.log('[Profile] Image deleted from Cloudinary');
  } catch (err) {
    console.log('[Profile] Could not delete image from Cloudinary:', err.message);
  }

  user.profilePicture = undefined;
  await user.save();

  // Log activity
  await ActivityLog.create({
    user: user._id,
    action: 'Deleted Profile Picture',
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'Profile picture deleted successfully',
    profileCompletionPercentage: user.profileCompletionPercentage
  });
});

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
};
