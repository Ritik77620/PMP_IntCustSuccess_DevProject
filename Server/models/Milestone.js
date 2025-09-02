import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    weightage: { type: Number, required: true }, // changed from sequence → weightage
  },
  { timestamps: true } // optional: adds createdAt & updatedAt fields
);

const Milestone = mongoose.model("Milestone", milestoneSchema);
export default Milestone;
