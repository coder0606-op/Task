import express from "express";
import { createBoard, getBoards ,addMember} from "../controllers/boardController.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.post("/", auth, createBoard);
router.get("/", auth, getBoards);
router.post("/add-member", auth, addMember);
export default router;
