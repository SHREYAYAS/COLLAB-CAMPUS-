const mongoose = require('mongoose');
const { Schema } = mongoose;

// Pending Project Invite schema
// - project: the project the invite is for
// - fromUser: the user who sent the invite
// - toUser: the user receiving the invite
// - status: lifecycle of the invite (pending | accepted | declined)
const InviteSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type:  String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invite', InviteSchema);
