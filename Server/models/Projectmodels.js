import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
});

// Prevent OverwriteModelError
const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
