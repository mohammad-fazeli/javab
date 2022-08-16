import { Router } from "express";
import validateRequest from "../middleware/validateRequest";
import { isAuth, isAdmin } from "../utils/auth";
//import schema for validation
import { LessonSchema } from "../schema/lesson.schema";
//import controller
import {
  getAllLessons,
  addLesson,
  editLesson,
  deleteLesson,
} from "../controller/lesson.controller";
import { getPractices } from "../controller/practice.controller";

const router = Router();

router.get("/", isAuth, getAllLessons);
router.get("/:id", isAuth, getPractices);
router.post("/", isAuth, isAdmin, validateRequest(LessonSchema), addLesson);
router.put("/:id", isAuth, isAdmin, validateRequest(LessonSchema), editLesson);
router.delete("/:id", isAuth, isAdmin, deleteLesson);

export default router;
