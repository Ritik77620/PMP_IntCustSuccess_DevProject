import mongoose from "mongoose";

const subMilestoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: "Milestone", required: true },
  sequence: { type: Number, required: true },
});

const SubMilestone = mongoose.model("SubMilestone", subMilestoneSchema);

export default SubMilestone;  // <-- This export default is required
