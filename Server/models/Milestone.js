import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sequence: { type: Number, required: true }
});

const Milestone = mongoose.model("Milestone", milestoneSchema);
export default Milestone;
