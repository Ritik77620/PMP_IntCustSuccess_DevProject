import Ticket from "../models/ticketModel.js";

/**
 * GET /api/tickets
 * Query params:
 *   - search (optional): text to match in title or description
 *   - page (optional): default 1
 *   - limit (optional): default 25
 */
export const getTickets = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 25 } = req.query;
    const q = search
      ? { $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }] }
      : {};

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Ticket.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Ticket.countDocuments(q),
    ]);

    res.json({
      items,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/tickets
 * Body: { title, description, priority, status, assignedTo }
 */
export const createTicket = async (req, res, next) => {
  try {
    const { title, description, priority, status, assignedTo } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || "Medium",
      status: status || "Open",
      assignedTo: assignedTo || null,
    });

    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/tickets/:id
 * Body: partial { title?, description?, priority?, status?, assignedTo? }
 */
export const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (req.body.title !== undefined) ticket.title = req.body.title;
    if (req.body.description !== undefined) ticket.description = req.body.description;
    if (req.body.priority !== undefined) ticket.priority = req.body.priority;
    if (req.body.status !== undefined) ticket.status = req.body.status;
    if (req.body.assignedTo !== undefined) ticket.assignedTo = req.body.assignedTo;

    const updated = await ticket.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tickets/:id
 */
export const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await ticket.deleteOne();
    res.json({ message: "Ticket removed" });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tickets/:id
 */
export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};