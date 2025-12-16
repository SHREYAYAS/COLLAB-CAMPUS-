const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Resume = require('../models/Resume');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only certain file types (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || 
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                   file.mimetype === 'application/msword';
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   POST /api/resumes
// @desc    Upload a resume and optional CV
// @access  Private
router.post('/', auth, upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), async (req, res) => {
  try {
    const { company, jobRole, jobUrl, status, jobDescription, notes } = req.body;

    // Validate required fields
    if (!company || !jobRole) {
      return res.status(400).json({ msg: 'Company and job role are required' });
    }

    if (!req.files || !req.files.resume || !req.files.resume[0]) {
      return res.status(400).json({ msg: 'Resume file is required' });
    }

    const resumeFile = req.files.resume[0];
    const cvFile = req.files.cv ? req.files.cv[0] : null;

    // Create resume entry
    const newResume = new Resume({
      user: req.user.id,
      company: company.trim(),
      jobRole: jobRole.trim(),
      jobUrl: jobUrl ? jobUrl.trim() : '',
      resumeFilename: resumeFile.filename,
      cvFilename: cvFile ? cvFile.filename : null,
      status: status || 'pending',
      jobDescription: jobDescription || '',
      notes: notes || '',
    });

    const savedResume = await newResume.save();

    // Build response with file URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = {
      _id: savedResume._id,
      company: savedResume.company,
      jobRole: savedResume.jobRole,
      jobUrl: savedResume.jobUrl,
      resumeFilename: savedResume.resumeFilename,
      cvFilename: savedResume.cvFilename,
      fileUrl: `${baseUrl}/uploads/${savedResume.resumeFilename}`,
      cvUrl: savedResume.cvFilename ? `${baseUrl}/uploads/${savedResume.cvFilename}` : null,
      status: savedResume.status,
      jobDescription: savedResume.jobDescription,
      notes: savedResume.notes,
      createdAt: savedResume.createdAt,
    };

    res.status(201).json(response);
  } catch (err) {
    console.error('Resume upload error:', err.message);
    if (err.message.includes('Only PDF')) {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/resumes
// @desc    Get all resumes for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'username email');

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const resumesWithUrls = resumes.map(resume => ({
      _id: resume._id,
      company: resume.company,
      jobRole: resume.jobRole,
      jobUrl: resume.jobUrl,
      resumeFilename: resume.resumeFilename,
      cvFilename: resume.cvFilename,
      fileUrl: `${baseUrl}/uploads/${resume.resumeFilename}`,
      cvUrl: resume.cvFilename ? `${baseUrl}/uploads/${resume.cvFilename}` : null,
      status: resume.status,
      jobDescription: resume.jobDescription,
      notes: resume.notes,
      createdAt: resume.createdAt,
      user: resume.user,
    }));

    res.json(resumesWithUrls);
  } catch (err) {
    console.error('Get resumes error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/resumes/:id
// @desc    Get a specific resume by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id })
      .populate('user', 'username email');

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = {
      _id: resume._id,
      company: resume.company,
      jobRole: resume.jobRole,
      jobUrl: resume.jobUrl,
      resumeFilename: resume.resumeFilename,
      cvFilename: resume.cvFilename,
      fileUrl: `${baseUrl}/uploads/${resume.resumeFilename}`,
      cvUrl: resume.cvFilename ? `${baseUrl}/uploads/${resume.cvFilename}` : null,
      status: resume.status,
      jobDescription: resume.jobDescription,
      notes: resume.notes,
      createdAt: resume.createdAt,
      user: resume.user,
    };

    res.json(response);
  } catch (err) {
    console.error('Get resume error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/resumes/:id
// @desc    Update resume status, notes, or other fields
// @access  Private
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status, jobDescription, notes, company, jobRole, jobUrl } = req.body;

    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    // Validate status if provided
    if (status && !['pending', 'selected', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    // Update fields if provided
    if (status !== undefined) resume.status = status;
    if (jobDescription !== undefined) resume.jobDescription = jobDescription;
    if (notes !== undefined) resume.notes = notes;
    if (company !== undefined) resume.company = company.trim();
    if (jobRole !== undefined) resume.jobRole = jobRole.trim();
    if (jobUrl !== undefined) resume.jobUrl = jobUrl.trim();

    await resume.save();

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = {
      _id: resume._id,
      company: resume.company,
      jobRole: resume.jobRole,
      jobUrl: resume.jobUrl,
      resumeFilename: resume.resumeFilename,
      cvFilename: resume.cvFilename,
      fileUrl: `${baseUrl}/uploads/${resume.resumeFilename}`,
      cvUrl: resume.cvFilename ? `${baseUrl}/uploads/${resume.cvFilename}` : null,
      status: resume.status,
      jobDescription: resume.jobDescription,
      notes: resume.notes,
      createdAt: resume.createdAt,
    };

    res.json(response);
  } catch (err) {
    console.error('Update resume error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/resumes/:id
// @desc    Delete a resume entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    // Optional: Delete physical files from uploads folder
    const fs = require('fs');
    const resumePath = path.join(__dirname, '..', 'uploads', resume.resumeFilename);
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
    }
    
    if (resume.cvFilename) {
      const cvPath = path.join(__dirname, '..', 'uploads', resume.cvFilename);
      if (fs.existsSync(cvPath)) {
        fs.unlinkSync(cvPath);
      }
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Resume deleted successfully' });
  } catch (err) {
    console.error('Delete resume error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
