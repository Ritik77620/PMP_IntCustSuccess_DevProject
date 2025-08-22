import Milestone from "../models/milestoneModel.js";

/**
 * GET /api/milestones
 * Query params:
 *   - search (optional): text to match in name
 *   - page (optional): default 1
 *   - limit (optional): default 25
 */
export const getMilestones = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 25 } = req.query;
    const q = search
      ? { name: { $regex: String(search), $options: "i" } }
      : {};

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Milestone.find(q).sort({ sequence: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Milestone.countDocuments(q)
    ]);

    res.json({
      items,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/milestones
 * Body: { name: string, sequence: number }
 */
export const createMilestone = async (req, res, next) => {
  try {
    const { name, sequence } = req.body;

    if (!name || sequence === undefined || sequence === null) {
      return res.status(400).json({ message: "name and sequence are required" });
    }

    const milestone = await Milestone.create({ name, sequence });
    res.status(201).json(milestone);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/milestones/:id
 * Body: partial { name?, sequence? }
 */
export const updateMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findById(id);
    if (!milestone) return res.status(404).json({ message: "Milestone not found" });

    if (req.body.name !== undefined) milestone.name = req.body.name;
    if (req.body.sequence !== undefined) milestone.sequence = req.body.sequence;

    const updated = await milestone.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/milestones/:id
 */
export const deleteMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findById(id);
    if (!milestone) return res.status(404).json({ message: "Milestone not found" });

    await milestone.deleteOne();
    res.json({ message: "Milestone removed" });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/milestones/:id
 */
export const getMilestoneById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findById(id);
    if (!milestone) return res.status(404).json({ message: "Milestone not found" });
    res.json(milestone);
  } catch (err) {
    next(err);
  }
};
