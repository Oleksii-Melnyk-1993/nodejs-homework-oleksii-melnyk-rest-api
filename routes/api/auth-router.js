import express from "express";
import validate from "../../helpers/validate.js";
import { userSignInSchema, userSignUpSchema } from "../../models/User.js";
import authController from "../../controllers/auth-controller.js";
import { authenticate } from "../../middlewares/index.js";
import upload from "../../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/signup", validate(userSignUpSchema), authController.signup);
authRouter.post("/signin", validate(userSignInSchema), authController.signin);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.post("/current", authenticate, authController.getCurrentUser);
authRouter.patch(
  "/subscription",
  authenticate,
  authController.updateSubscription
);
authRouter.patch(
  "/users/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

export default authRouter;
