const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    details: {
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      college: { type: String },
      course: { type: String },
      year: { type: String },
      skills: { type: [String], default: [] },
      resumePath: { type: String },
      notes: { type: String },
    },
    status: {
      type: String,
      enum: ['Applied', 'Viewed', 'Under Review', 'Shortlisted', 'Accepted', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    resume: {
      type: String, // Link to resume file
    },
    atsScore: {
      type: Number,
      default: 0
    },
    coverLetter: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Application', applicationSchema);
