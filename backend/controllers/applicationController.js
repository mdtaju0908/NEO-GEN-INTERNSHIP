const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const Resume = require('../models/Resume');
const User = require('../models/User');
const axios = require('axios');

// Helper to calculate ATS Score via ATS Django API
const calculateAtsScore = async (resumeUrl, jobDescription) => {
  try {
    const baseUrl = process.env.ATS_API_URL;
    if (!baseUrl) {
      console.warn('[ATS] ATS_API_URL not set. Returning default score 0.');
      return { ats_score: 0 };
    }
    const url = `${baseUrl.replace(/\/+$/, '')}/ats/score`;
    const response = await axios.post(url, { resumeUrl, jobDescription }, { timeout: 15000 });
    return response.data || { ats_score: 0 };
  } catch (err) {
    console.error(`[ATS] HTTP error: ${err.message}`);
    return { ats_score: 0 };
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
const getApplications = asyncHandler(async (req, res) => {
  const { internshipId } = req.query;

  let query = {};
  if (internshipId) {
    query.internship = internshipId;
  }

  const applications = await Application.find(query)
    .populate('student', 'name email profilePicture isBlocked partnerInfo')
    .populate('internship', 'title organization createdBy')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(applications);
});

// @desc    Create new application (Student)
// @route   POST /api/applications
// @access  Private/Student
const createApplication = asyncHandler(async (req, res) => {
  const { internshipId, coverLetter, form } = req.body;

  if (!internshipId) {
    res.status(400);
    throw new Error('Internship ID is required');
  }

  // Check if internship exists and is active
  const internship = await Internship.findById(internshipId);
  if (!internship) {
    res.status(404);
    throw new Error('Internship not found');
  }

  if (internship.status !== 'active') {
    res.status(400);
    throw new Error('This internship is no longer accepting applications');
  }

  // Check if already applied
  const existingApplication = await Application.findOne({
    student: req.user.id,
    internship: internshipId,
  });

  if (existingApplication) {
    res.status(400);
    throw new Error('You have already applied to this internship');
  }

  // If a structured form is provided, validate basic fields
  const details = form ? {
    fullName: String(form.fullName || '').trim(),
    email: String(form.email || '').trim().toLowerCase(),
    phone: String(form.phone || '').trim(),
    college: String(form.college || '').trim(),
    course: String(form.course || '').trim(),
    year: String(form.year || '').trim(),
    skills: Array.isArray(form.skills) ? form.skills.map(s => String(s).trim()).filter(Boolean) : [],
    resumePath: form.resumePath || null,
    notes: String(form.notes || '').trim(),
  } : {};

  if (form) {
    if (!details.fullName || !details.email) {
      res.status(400);
      throw new Error('Full name and email are required');
    }
    // Ensure email matches logged-in user record to avoid impersonation
    const me = await User.findById(req.user.id);
    if (me && me.email.toLowerCase() !== details.email) {
      res.status(400);
      throw new Error('Email must match your account email');
    }
  }

  // Get latest resume for ATS score and link (optional) if not provided
  let resumeDoc = null;
  if (!details.resumePath) {
    resumeDoc = await Resume.findOne({ user: req.user.id }).sort({ createdAt: -1 });
  }

  // Determine Resume URL
  const resumeUrl = details.resumePath || resumeDoc?.fileUrl || null;
  let finalAtsScore = resumeDoc?.atsScore || 0;

  // Calculate real-time ATS score if we have a resume URL and an internship description
  if (resumeUrl && internship) {
      const jobDesc = [
          internship.description,
          internship.requirements,
          (internship.requiredSkills || []).join(' ')
      ].join(' ');

      console.log(`[ATS] Calculating score for application...`);
      const atsResult = await calculateAtsScore(resumeUrl, jobDesc);
      if (atsResult && atsResult.ats_score) {
          finalAtsScore = atsResult.ats_score;
          console.log(`[ATS] Score calculated: ${finalAtsScore}`);
      }
  }

  const application = await Application.create({
    student: req.user.id,
    internship: internshipId,
    details,
    resume: resumeUrl,
    atsScore: finalAtsScore,
    coverLetter,
  });

  res.status(201).json(application);
});

// @desc    Apply with form data (explicit endpoint)
// @route   POST /api/applications/apply/:internshipId
// @access  Private/Student
const applyWithForm = asyncHandler(async (req, res) => {
  req.body.internshipId = req.params.internshipId;
  req.body.form = req.body.form || req.body; // accept direct body as form
  return createApplication(req, res);
});

// @desc    Get my applications (Student)
// @route   GET /api/applications/my
// @access  Private/Student
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ student: req.user.id })
    .populate('internship', 'title organization status');
  res.status(200).json(applications);
});

// @desc    Get applications for partner's internships
// @route   GET /api/applications/partner
// @access  Private/Partner
const getPartnerApplications = asyncHandler(async (req, res) => {
  const partnerId = req.user.id;

  const applications = await Application.find()
    .populate({
      path: 'internship',
      match: { createdBy: partnerId },
      select: 'title organization createdBy',
    })
    .populate('student', 'name email profilePicture')
    .sort({ createdAt: -1 })
    .lean();

  const filtered = applications.filter(app => app.internship);
  res.status(200).json(filtered);
});

// @desc    Get application by ID (Admin)
// @route   GET /api/applications/:id
// @access  Private/Admin
const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('student', 'name email phone university course profilePicture')
    .populate('internship', 'title organization department');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  res.status(200).json(application);
});
// @desc    Update application status (Admin)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  application.status = status;
  await application.save();

  res.status(200).json(application);
});

module.exports = {
  getApplications,
  createApplication,
  getMyApplications,
  updateApplicationStatus,
  getPartnerApplications,
  applyWithForm,
  getApplicationById,
};
