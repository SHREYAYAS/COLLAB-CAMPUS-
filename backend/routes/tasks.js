const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// GET /api/tasks
// Return all tasks assigned to the current user across all projects (flat array)
// Protected
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const uid = new mongoose.Types.ObjectId(userId);

    // Aggregate across projects -> tasks embedded array
    const results = await Project.aggregate([
      { $match: { members: uid } }, // only projects the user is a member of
      { $unwind: '$tasks' },
      { $match: { 'tasks.assignedTo': uid } },
      { $sort: { 'tasks.createdAt': -1 } },
      {
        $project: {
          // Return only the task subdocument
          _id: 0,
          task: '$tasks',
        },
      },
    ]);

    // Flatten to array of task docs
    const tasks = results.map((r) => r.task);
    return res.json(tasks);
  } catch (err) {
    console.error('GET /api/tasks error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
