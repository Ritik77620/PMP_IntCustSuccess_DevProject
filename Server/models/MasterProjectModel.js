import mongoose from "mongoose";

const masterProjectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectCode: { type: String, required: false, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

// ✅ Model with its own collection
const MasterProjectModel =
  mongoose.models.MasterProjectModel ||
  mongoose.model("MasterProjectModel", masterProjectSchema);

export default MasterProjectModel;
