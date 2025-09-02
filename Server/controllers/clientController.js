import Client from "../models/Client.js";

// Create a new client
export const createClient = async (req, res) => {
  try {
    const { clientName, gst, email, locations } = req.body;

    if (!clientName || !email) {
      return res.status(400).json({ message: "Client Name and Email are required" });
    }

    // Validate locations and units with SPOC per location
    const sanitizedLocations = (locations || []).map(loc => ({
      locationName: loc.locationName || "",
      spoc: loc.spoc || "", // SPOC per location
      units: (loc.units || []).map(unit => ({ unitName: unit.unitName || "" })),
    }));

    const client = new Client({ clientName, gst, email, locations: sanitizedLocations });
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get client by ID
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update client
export const updateClient = async (req, res) => {
  try {
    const { clientName, gst, email, locations } = req.body;

    if (!clientName || !email) {
      return res.status(400).json({ message: "Client Name and Email are required" });
    }

    const sanitizedLocations = (locations || []).map(loc => ({
      locationName: loc.locationName || "",
      spoc: loc.spoc || "", // SPOC per location
      units: (loc.units || []).map(unit => ({ unitName: unit.unitName || "" })),
    }));

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { clientName, gst, email, locations: sanitizedLocations },
      { new: true }
    );

    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
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
