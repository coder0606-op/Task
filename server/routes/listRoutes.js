import express from "express";
import { createList, getLists } from "../controllers/listController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createList);
router.get("/:boardId", auth, getLists);

export default router;
