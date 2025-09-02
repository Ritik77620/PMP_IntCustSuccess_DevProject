import express from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

const router = express.Router();

// Base route: /api/clients
router
  .route("/")
  .get(getClients)      // GET: fetch all clients
  .post(createClient);  // POST: create a new client (payload includes locations with SPOC)

// Route with ID: /api/clients/:id
router
  .route("/:id")
  .get(getClientById)   // GET: fetch client by ID
  .put(updateClient)    // PUT: update client by ID (payload includes locations with SPOC)
  .delete(deleteClient);// DELETE: remove client by ID

export default router;
