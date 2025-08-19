import mongoose from "mongoose";

const timeEntrySchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  taskId: { type: String },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
  notes: { type: String },
  dayType: { type: String, default: "Regular" },
  rateType: { type: String, default: "Standard" },
  approvalStatus: { type: String, default: "pending" }, // pending, approved, rejected
}, { timestamps: true });

export default mongoose.model("TimeEntry", timeEntrySchema);
