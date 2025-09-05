import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    project: { type: String, required: true },
    projectCode: { type: String, required: false, unique: true },
    name: { type: String, required: true }, // project type
    client: { type: String, required: true },
    clientLocation: { type: String },   // ✅ add this
    unit: { type: String },             // ✅ add this
    milestone: { type: String, required: false },
    planStart: { type: Date, required: true },
    planClose: { type: Date, required: true },
    actualStart: { type: Date },
    actualClose: { type: Date },
    status: { type: String, enum: ["Running", "Completed", "Delayed", "On Hold"], default: "Running" },
    bottleneck: { type: String },
    remark: { type: String },
    progress: { type: Number, default: 0 },
    gapInDays: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
