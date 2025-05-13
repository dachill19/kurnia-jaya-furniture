import express from "express";
import {
    createProductController,
    updateProductController,
    deleteProductController,
} from "../../controllers/product.controller.js";
import { authenticate, authorizeAdmin } from "../../middlewares/auth.js";

const router = express.Router();

// Semua endpoint ini hanya bisa diakses oleh admin
router.post("/", authenticate, authorizeAdmin, createProductController);
router.put("/:id", authenticate, authorizeAdmin, updateProductController);
router.delete("/:id", authenticate, authorizeAdmin, deleteProductController);

export default router;
