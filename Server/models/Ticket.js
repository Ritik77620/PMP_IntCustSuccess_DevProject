import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true },
  clientName: String,
  location: String,
  dateRaised: String,
  timeRaised: String,
  category: String,
  raisedBy: String,
  assignedTo: String,
  description: String,
  totalDaysElapsed: String,
  status: String,
  priority: String,
  resolution: String,
  dateClosed: String,
  timeClosed: String,
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;