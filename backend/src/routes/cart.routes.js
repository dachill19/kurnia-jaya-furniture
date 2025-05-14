import express from "express";
import {
    addCartController,
    getCartController,
    updateCartByProductController,
    removeCartByProductController,
    clearCartController,
} from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

router.delete("/clear", clearCartController);
router.post("/", addCartController);
router.get("/", getCartController);
router.put("/product/:productId", updateCartByProductController);
router.delete("/product/:productId", removeCartByProductController);

export default router;
