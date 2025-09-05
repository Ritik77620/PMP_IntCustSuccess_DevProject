import mongoose from "mongoose";

const { Schema, model } = mongoose;

const projectMilestoneSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  name: { type: String, required: true },
  planStartDate: { type: Date,required: true  },
  planCloseDate: { type: Date,required: true  },
  actualStartDate: { type: Date },
  actualCloseDate: { type: Date },
  responsibility: { type: String,required: true  },
  status: { type: String, enum: ["Open", "In Progress", "Closed"], default: "Open" }, // ✅ Added status
  remark: { type: String },
});

export default model("ProjectMilestone", projectMilestoneSchema);
