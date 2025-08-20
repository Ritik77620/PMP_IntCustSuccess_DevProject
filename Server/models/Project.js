import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: { type: String, required: true },
  siteName: { type: String },
  projectManager: { type: String },
  milestone: { type: String },
  planStart: { type: Date },
  planClose: { type: Date },
  actualStart: { type: Date },
  actualClose: { type: Date },
  gapInDays: { type: Number },
  status: {
    type: String,
    enum: ["active", "planning", "completed", "on_hold"],
    default: "active",
  },
  bottleneck: { type: String },
  remark: { type: String },
  progress: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);
