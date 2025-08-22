import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientLocation: { type: String },
  gst: { type: String },
  email: { type: String },
  spoc: { type: String }
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
