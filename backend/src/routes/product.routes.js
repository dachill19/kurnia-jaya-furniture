import express from 'express';
import { getAllProductsController, getProductByIdController, getProductsByCategoryController, getHotProductsController, getLatestProductsController, getDiscountedProductsController, createProductController, updateProductController, deleteProductController } from '../controllers/product.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.js';  // Untuk autentikasi admin

const router = express.Router();

router.get("/hot", getHotProductsController);
router.get("/latest", getLatestProductsController);
router.get("/discounted", getDiscountedProductsController);

router.get('/category/:categoryName', getProductsByCategoryController);
router.get('/', getAllProductsController); // contoh: ?sort=price_desc
router.get('/:id', getProductByIdController);

// Endpoint untuk admin
router.post('/', authenticate, authorizeAdmin, createProductController);
router.put('/:id', authenticate, authorizeAdmin, updateProductController);
router.delete('/:id', authenticate, authorizeAdmin, deleteProductController);

export default router;