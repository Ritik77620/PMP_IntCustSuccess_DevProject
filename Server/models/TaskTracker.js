import mongoose from "mongoose";

const taskTrackerSchema = new mongoose.Schema(
  {
    raisedDate: { type: Date, default: Date.now }, // Auto-fill if not provided
    assignedTo: { type: String, required: true },  // Can later link to User Master
    type: { type: String, enum: ["Issue", "Requirement"], required: true },
    client: { type: String, required: true },
    issue: { type: String, required: true }, // Issue / Requirement description
    produceStep: { type: String },
    sampleData: { type: String },
    acceptanceCriteria: { type: String },
    status: { type: String, enum: ["Open", "In Progress", "Closed"], default: "Open" },
    expectedClosureDate: { type: Date },
    actualClosureDate: { type: Date },
    testingStatus: { type: String },
    testingDoneBy: { type: String },
  },
  { timestamps: true }
);

const TaskTracker = mongoose.model("TaskTracker", taskTrackerSchema);
export default TaskTracker;
