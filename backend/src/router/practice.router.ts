import { Router } from "express";
import validateRequest from "../middleware/validateRequest";
import upload from "../middleware/uploadFiles";
import { isAuth, isAdmin } from "../utils/auth";
//import schema for validation
import { createPracticeSchema } from "../schema/practice.schema";
//import controller
import {
  getPractice,
  createPractice,
  editPractice,
  deletePractice,
} from "../controller/practice.controller";

const router = Router();

router.get("/:id", isAuth, getPractice);
router.post(
  "/",
  isAuth,
  upload("file"),
  validateRequest(createPracticeSchema),
  createPractice
);
router.put("/:id", isAuth, upload("file"), editPractice);
router.delete("/:id", isAuth, deletePractice);

export default router;
