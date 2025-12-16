const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  jobRole: {
    type: String,
    required: true,
    trim: true,
  },
  jobUrl: {
    type: String,
    trim: true,
  },
  resumeFilename: {
    type: String,
    required: true,
  },
  cvFilename: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'selected', 'rejected'],
    default: 'pending',
  },
  jobDescription: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', ResumeSchema);
