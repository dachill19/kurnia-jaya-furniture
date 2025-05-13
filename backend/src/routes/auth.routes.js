import express from "express";
import {
    registerController,
    loginController,
    getUserProfileController,
    updateUserProfileController,
} from "../controllers/auth.controller.js";
import {
    registerValidation,
    loginValidation,
    updateValidation,
} from "../validators/authValidator.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerValidation, validate, registerController);
router.post("/login", loginValidation, validate, loginController);
router.get("/profile", authenticate, getUserProfileController);
router.patch(
    "/profile",
    updateValidation,
    authenticate,
    validate,
    updateUserProfileController
);

export default router;
