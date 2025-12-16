const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- Sub-document for Tasks ---
const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '', // optional text
  },
  status: {
    type: String,
    enum: ['To-Do', 'In-Progress', 'Done'], // The status must be one of these
    default: 'To-Do',
  },
  createdBy: {
    type: Schema.Types.ObjectId, // A reference to the user who created it
    ref: 'User',
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  dueDate: {
    type: Date,
    default: null,
  }
}, { timestamps: true });


// --- Sub-document for Chat Messages ---
const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// --- Sub-document for Project Files ---
const FileSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileURL: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});


// --- Main Project Schema ---
const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  githubURL: {
    type: String,
    default: '',
  },
  owner: {
    type: Schema.Types.ObjectId, // A reference to the user who owns the project
    ref: 'User',
    required: true,
  },
  members: [{ // An array of user IDs
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  tasks: [TaskSchema], // An array of embedded Task documents
  chatMessages: [MessageSchema], // An array of embedded Message documents
  files: [FileSchema], // An array of embedded File documents
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);