import mongoose from 'mongoose';

const milestoneSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sequence: {
      type: String,
    },
  },
  { timestamps: true }
);

const Milestone = mongoose.model('Milestone', milestoneSchema);

export default Milestone;
