import express from "express";
import {
    getAllProductsController,
    getProductByIdController,
    getHotProductsController,
    getLatestProductsController,
    getDiscountedProductsController,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/hot", getHotProductsController);
router.get("/latest", getLatestProductsController);
router.get("/discounted", getDiscountedProductsController);

router.get("/", getAllProductsController); // contoh: ?sort=price_desc
router.get("/:id", getProductByIdController);

export default router;
