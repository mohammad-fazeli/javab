import { Router } from "express";
import validateRequest from "../middleware/validateRequest";
import upload from "../middleware/uploadFiles";
import { isAuth, isAdmin } from "../utils/auth";
//import schema for validation
import { addAnswerSchema } from "../schema/answer.schema";
//import controller
import {
  addAnswer,
  editAnswer,
  deleteAnswer,
  increaseRate,
  decreaseRate,
} from "../controller/answer.controller";

const router = Router();

router.post(
  "/",
  isAuth,
  upload("file"),
  validateRequest(addAnswerSchema),
  addAnswer
);
router.put("/:answer_id", upload("file"), isAuth, editAnswer);
router.delete("/:answer_id", isAuth, deleteAnswer);
router.put("/rate/increase/:answer_id", isAuth, increaseRate);
router.put("/rate/decrease/:answer_id", isAuth, decreaseRate);

export default router;
