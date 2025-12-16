const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our auth middleware
const Project = require('../models/Project'); // Project model
const User = require('../models/User'); // User model
const Invite = require('../models/Invite'); // Invite model
const transporter = require('../config/mailer');
const mongoose = require('mongoose');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (because we use the 'auth' middleware)
router.post('/', auth, async (req, res) => {
  const { title } = req.body;

  try {
    const newProject = new Project({
      title,
      owner: req.user.id, // req.user.id comes from our auth middleware
      members: [req.user.id], // The creator is the first member
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/projects
// @desc    Get all projects for a user (supports pagination via ?limit=&skip=)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const limit = Math.max(0, parseInt(req.query.limit, 10) || 0);
    const skip = Math.max(0, parseInt(req.query.skip, 10) || 0);

    // Find all projects where the 'members' array contains the logged-in user's ID
    const query = Project.find({ members: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('owner', 'username email');

    const projects = await query.exec();
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// We will add routes for tasks, invites, etc., later.
// ...

// @route   GET /api/projects/:id
// @desc    Get a single project's full details (only if user is a member)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid project ID' });
    }

    // Only return the project if the current user is a member
    const project = await Project.findOne({ _id: id, members: req.user.id })
      .populate('owner', 'username email')
      .populate('members', 'username email')
      .populate('tasks.createdBy', 'username email')
      .populate('tasks.assignedTo', 'username email')
      .populate('chatMessages.sender', 'username email');

    if (!project) {
      // Hide whether the project exists if not a member
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Also include invites for this project so UI can show pending/accepted
    const invites = await Invite.find({ project: id })
      .populate('toUser', 'username email');

    res.json({ project, invites });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ---------- TASKS ----------
const ALLOWED_STATUSES = ['To-Do', 'In-Progress', 'Done'];
// Accept common variants from frontend and normalize to our enum labels
const STATUS_ALIASES = {
  'to-do': 'To-Do',
  'todo': 'To-Do',
  'to do': 'To-Do',
  'in-progress': 'In-Progress',
  'in progress': 'In-Progress',
  'inprogress': 'In-Progress',
  'done': 'Done',
};

function normalizeStatus(input) {
  if (!input && input !== '') return undefined;
  const raw = String(input).trim();
  if (!raw) return undefined;
  const lower = raw.toLowerCase();
  // direct alias hit
  if (STATUS_ALIASES[lower]) return STATUS_ALIASES[lower];
  // allow exact enum values regardless of case
  const idx = ALLOWED_STATUSES.map((s) => s.toLowerCase()).indexOf(lower);
  if (idx !== -1) return ALLOWED_STATUSES[idx];
  return undefined;
}

// @route   POST /api/projects/:id/tasks
// @desc    Create a new task in a project (must be a project member)
// @access  Private
router.post('/:id/tasks', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, assignedTo, status } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid project ID' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ msg: 'Task title is required' });
    }

    const statusNorm = normalizeStatus(status);
    if (status && !statusNorm) {
      return res.status(400).json({ msg: 'Invalid task status' });
    }

    // Ensure the current user is a member of the project
    const project = await Project.findOne({ _id: id, members: req.user.id });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Normalize fields
    const cleanAssignedTo = assignedTo === '' ? null : assignedTo;
    const cleanDescription = typeof description === 'string' ? description : '';
    const cleanDueDate = dueDate ? new Date(dueDate) : null;

    const newTask = {
      title: title.trim(),
      description: cleanDescription,
      status: statusNorm || undefined,
      createdBy: req.user.id,
      assignedTo: cleanAssignedTo || null,
      dueDate: cleanDueDate,
    };

    project.tasks.push(newTask);
    await project.save();

    // Return the newly created task (last element)
    const created = project.tasks[project.tasks.length - 1];
    res.status(201).json(created);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/projects/:projectId/tasks/:taskId
// @desc    Update a task's title or status (must be a project member)
// @access  Private
router.patch('/:projectId/tasks/:taskId', auth, async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, status } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ msg: 'Invalid ID' });
    }

    const statusNorm = normalizeStatus(status);
    if (status && !statusNorm) {
      return res.status(400).json({ msg: 'Invalid task status' });
    }

    const project = await Project.findOne({ _id: projectId, members: req.user.id });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const task = project.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    if (typeof title === 'string') task.title = title.trim();
  if (statusNorm) task.status = statusNorm;

    await project.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/projects/:id/tasks/:taskId
// @desc    Update a task's status (for drag-and-drop in Kanban)
// @access  Private
router.put('/:id/tasks/:taskId', auth, async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const { status } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ msg: 'Invalid ID' });
    }

    const statusNorm = normalizeStatus(status);
    if (!statusNorm) {
      return res.status(400).json({ msg: 'Invalid task status' });
    }

    // Ensure requester is a member of the project
    const project = await Project.findOne({ _id: id, members: req.user.id });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const task = project.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

  task.status = statusNorm;
    await project.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project (owner only) and cleanup related invites
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid project ID' });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Security: only the owner can delete the project
    if (String(project.owner) !== String(req.user.id)) {
      return res.status(401).json({ msg: 'Unauthorized: only the project owner can delete this project' });
    }

    await Project.findByIdAndDelete(id);
    await Invite.deleteMany({ project: id });

    return res.json({ msg: 'Project deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ---------- INVITES ----------
// @route   POST /api/projects/:id/invite
// @desc    Invite a user (by email) to join a project (must be a member)
// @access  Private
router.post('/:id/invite', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid project ID' });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const userToInvite = await User.findOne({ email: email.trim() });
    if (!userToInvite) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Ensure the requester is a member of the project
    const project = await Project.findOne({ _id: id, members: req.user.id });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // If already member, stop here
    const alreadyMember = project.members.some((m) => m.equals(userToInvite._id));
    if (alreadyMember) {
      return res.status(400).json({ msg: 'User is already a member.' });
    }

    // Prevent duplicate pending invites for same project and user
    const existingInvite = await Invite.findOne({ project: id, toUser: userToInvite._id, status: 'pending' });
    if (existingInvite) {
      return res.status(400).json({ msg: 'Invite already sent.' });
    }

    const invite = new Invite({
      project: id,
      fromUser: req.user.id,
      toUser: userToInvite._id,
      status: 'pending',
    });

    await invite.save();

    // Send notification email (best-effort; do not fail request on mail error)
    try {
      // Ensure we have the project title and inviter's username
      const inviter = await User.findById(req.user.id).select('username email');
      // If project not loaded earlier (it is), ensure we have title
      const projectTitle = project.title;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userToInvite.email,
        subject: "You're invited to CollabCampus!",
        html: `<h3>Hi ${userToInvite.username},</h3>
<p>${inviter?.username || 'A teammate'} has invited you to join the project <strong>${projectTitle}</strong> on CollabCampus.</p>
<p>Please log in to accept your invite.</p>`,
      };

      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error('Failed to send invite email:', mailErr.message);
    }

    return res.json({ msg: 'Invite created', inviteId: invite._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
// @route   PUT /api/projects/:id/github
// @desc    Update project's GitHub repository URL
// @access  Private
router.put('/:id/github', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { githubURL } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid project ID' });
    }

    if (githubURL === undefined) {
      return res.status(400).json({ msg: 'githubURL is required' });
    }

    if (githubURL && typeof githubURL !== 'string') {
      return res.status(400).json({ msg: 'githubURL must be a string' });
    }

    // Optional: rudimentary URL validation (only if non-empty)
    const cleaned = typeof githubURL === 'string' ? githubURL.trim() : '';
    if (cleaned && !/^https:\/\/github\.com\//i.test(cleaned)) {
      // Not a fatal error per spec, but we choose to enforce a GitHub prefix; adjust if needed
      return res.status(400).json({ msg: 'githubURL must start with https://github.com/' });
    }

    // Update only the githubURL field
    const updated = await Project.findByIdAndUpdate(
      id,
      { $set: { githubURL: cleaned } },
      { new: true }
    )
      .populate('owner', 'username email')
      .populate('members', 'username email');

    if (!updated) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    return res.json(updated);
  } catch (err) {
    console.error('Update githubURL error:', err.message);
    res.status(500).send('Server Error');
  }
});