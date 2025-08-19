import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: String,
  client: String,
  siteName: String,
  projectManager: String,
  status: String,
  progress: Number,
  endDate: String,
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
