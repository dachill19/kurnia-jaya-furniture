import express from 'express';
import { getAllCategoriesController, getProductsByCategoryController } from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', getAllCategoriesController);
router.get('/:categoryName', getProductsByCategoryController);

export default router;