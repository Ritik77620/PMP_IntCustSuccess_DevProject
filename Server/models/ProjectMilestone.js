import mongoose from "mongoose";

const { Schema, model } = mongoose;

const projectMilestoneSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  name: { type: String, required: true },
  planStartDate: { type: Date },
  planCloseDate: { type: Date },
  actualStartDate: { type: Date },
  actualCloseDate: { type: Date },
  responsibility: { type: String },
  remark: { type: String },
});

export default model("ProjectMilestone", projectMilestoneSchema); // default export
