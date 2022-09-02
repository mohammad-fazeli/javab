import { Router } from "express";
import validateRequest from "../middleware/validateRequest";
import { isAdmin, isAuth, isAuthRefresh } from "../utils/auth";
//import schema for validation
import {
  registerUserSchema,
  loginUserSchema,
  restPasswordSchema,
  changePasswordSchema,
  deleteAccountSchema,
  setLessonSchema,
} from "../schema/user.schema";

//import controller
import {
  signup,
  verify,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteAccount,
  addSavedPractice,
  getSavedPractices,
  removeSavedPractice,
  setLessonToUser,
  getLessons,
  getAllUsers,
  refreshToken,
} from "../controller/user.controller";

const router = Router();

router.post("/signup", validateRequest(registerUserSchema), signup);
router.post("/verify/:token", verify);
router.post("/login", validateRequest(loginUserSchema), login);
router.post("/forgot-password/:email", forgotPassword);
router.post(
  "/reset-password",
  validateRequest(restPasswordSchema),
  resetPassword
);
router.put(
  "/change-password",
  isAuth,
  validateRequest(changePasswordSchema),
  changePassword
);
router.post(
  "/delete-account",
  isAuth,
  validateRequest(deleteAccountSchema),
  deleteAccount
);
router.post("/saved/:id", isAuth, addSavedPractice);
router.delete("/saved/:id", isAuth, removeSavedPractice);
router.get("/saved", isAuth, getSavedPractices);
router.post(
  "/set-lesson",
  isAuth,
  isAdmin,
  validateRequest(setLessonSchema),
  setLessonToUser
);
router.get("/lessons/:userId", isAuth, isAdmin, getLessons);
router.get("/", isAuth, isAdmin, getAllUsers);
router.get("/refresh", isAuthRefresh, refreshToken);
export default router;
