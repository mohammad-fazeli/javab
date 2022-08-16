import { Router } from "express";
import validateRequest from "../middleware/validateRequest";
import { isAuth } from "../utils/auth";
//import schema for validation
import { addCommentSchema } from "../schema/comment.schema";
//import controller
import {
  addComment,
  editComment,
  deleteComment,
} from "../controller/comment.controller";

const router = Router();

router.post("/", isAuth, validateRequest(addCommentSchema), addComment);
router.put("/:id", isAuth, editComment);
router.delete("/:id", isAuth, deleteComment);

export default router;
