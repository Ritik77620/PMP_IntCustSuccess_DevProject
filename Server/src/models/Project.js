import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  siteName: { type: String, required: true },
  projectManager: { type: String, required: true },
  status: { type: String, enum: ["active", "planning", "completed", "on_hold"], default: "active" },
  progress: { type: Number, default: 0 },
  endDate: { type: Date, required: true },
  client: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
