const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Invite = require('../models/Invite');
const Project = require('../models/Project');

// All routes here are protected
router.use(auth);

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1) GET /api/invites/me
// Find all pending invites for the logged-in user
// Populate project (title) and fromUser (username)
router.get('/me', async (req, res) => {
  try {
    const invites = await Invite.find({ toUser: req.user.id, status: 'pending' })
      .populate('project', 'title')
      .populate('fromUser', 'username');

    res.json(invites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 2) POST /api/invites/:id/accept
// Ensure invite belongs to current user, add them to project.members, mark invite accepted
router.post('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ msg: 'Invalid invite ID' });

    const invite = await Invite.findById(id);
    if (!invite) return res.status(404).json({ msg: 'Invite not found' });
    if (String(invite.toUser) !== String(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to act on this invite' });
    }

    // Load project and add member (idempotent)
    const project = await Project.findById(invite.project);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Only add if not already a member
    const alreadyMember = project.members.some((m) => String(m) === String(req.user.id));
    if (!alreadyMember) {
      project.members.push(req.user.id);
      await project.save();
    }

    // Mark invite accepted
    invite.status = 'accepted';
    await invite.save();

    res.json({ msg: 'Invite accepted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 3) POST /api/invites/:id/decline
// Ensure invite belongs to current user; mark declined
router.post('/:id/decline', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ msg: 'Invalid invite ID' });

    const invite = await Invite.findById(id);
    if (!invite) return res.status(404).json({ msg: 'Invite not found' });
    if (String(invite.toUser) !== String(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to act on this invite' });
    }

    invite.status = 'declined';
    await invite.save();

    res.json({ msg: 'Invite declined' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
