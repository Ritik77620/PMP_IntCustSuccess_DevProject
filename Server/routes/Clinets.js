import express from 'express';
import Client from '../models/Client.js';

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new client
router.post('/', async (req, res) => {
  try {
    const { clientName, clientLocation, gst, email, spoc } = req.body;
    if (!clientName) {
      return res.status(400).json({ message: 'Client Name is required' });
    }
    const client = new Client({ clientName, clientLocation, gst, email, spoc });
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update client by ID
router.put('/:id', async (req, res) => {
  try {
    const { clientName, clientLocation, gst, email, spoc } = req.body;
    if (!clientName) {
      return res.status(400).json({ message: 'Client Name is required' });
    }
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { clientName, clientLocation, gst, email, spoc },
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete client by ID
router.delete('/:id', async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
