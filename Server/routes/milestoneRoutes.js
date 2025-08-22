import express from 'express';
import Milestone from '../models/milestoneModel.js';

const router = express.Router();

// Get all milestones
router.get('/', async (req, res) => {
  try {
    const milestones = await Milestone.find();
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a milestone
router.post('/', async (req, res) => {
  const { name, sequence } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const milestone = new Milestone({ name, sequence });
  try {
    const saved = await milestone.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a milestone
router.put('/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    milestone.name = req.body.name || milestone.name;
    milestone.sequence = req.body.sequence || milestone.sequence;

    const updated = await milestone.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a milestone
router.delete('/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    await milestone.remove();
    res.json({ message: 'Milestone deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
