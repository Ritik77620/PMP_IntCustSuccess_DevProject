import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
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
      enum: ["Running", "Completed", "Delayed", "on_hold"],
      default: "Running", // 🔥 fixed default to match enum
    },
    bottleneck: { type: String },
    remark: { type: String },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
