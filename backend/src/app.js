import dotenv from "dotenv";
dotenv.config(); // <--- Ini WAJIB paling atas

import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";
import adminRoutes from "./routes/admin/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Tes connection
app.get("/", (req, res) => {
    res.send("Backend jalan!");
});

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);

export default app;
