import express from "express";
import {
    addWishlistController,
    getWishlistController,
    removeWishlistController,
} from "../controllers/wishlist.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate); // semua route perlu login

router.post("/", addWishlistController); // tambah ke wishlist
router.get("/", getWishlistController); // ambil wishlist user
router.delete("/:productId", removeWishlistController); // hapus produk dari wishlist

export default router;
