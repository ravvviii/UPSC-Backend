import express from "express";
import {
  createEditorial,
  getAllEditorials,
  getEditorialById,
  deleteEditorial,
  updateEditorial
} from "../controllers/editorial.controller.js";

const router = express.Router();
router.get("/ping", (req, res) => res.send("Editorial route OK"));

router.post("/", createEditorial);
router.get("/", getAllEditorials);
router.get("/:id", getEditorialById);
router.delete("/:id", deleteEditorial);
router.put("/:id", updateEditorial); 

export default router;
