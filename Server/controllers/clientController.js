import Client from "../models/client.js";

// Get all clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    // Map _id → id for frontend compatibility
    res.json(clients.map(c => ({
      id: c._id.toString(),
      clientName: c.clientName,
      clientLocation: c.clientLocation,
      gst: c.gst,
      email: c.email,
      spoc: c.spoc
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get client by id
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    res.json({
      id: client._id.toString(),
      clientName: client.clientName,
      clientLocation: client.clientLocation,
      gst: client.gst,
      email: client.email,
      spoc: client.spoc
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create client
export const createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();

    res.status(201).json({
      id: client._id.toString(),
      clientName: client.clientName,
      clientLocation: client.clientLocation,
      gst: client.gst,
      email: client.email,
      spoc: client.spoc
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update client
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ message: "Client not found" });

    res.json({
      id: client._id.toString(),
      clientName: client.clientName,
      clientLocation: client.clientLocation,
      gst: client.gst,
      email: client.email,
      spoc: client.spoc
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete client
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
