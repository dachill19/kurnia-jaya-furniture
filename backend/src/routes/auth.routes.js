import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import {
    registerValidation,
    loginValidation,
} from "../validators/authValidator.js";
import { validate } from "../middlewares/validate.js";
import { getProfile } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/profile", authenticate, getProfile);

export default router;
