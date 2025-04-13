import express from 'express';
import { addCartController, getCartController, updateCartController, removeCartController } from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', addCartController);
router.get('/', getCartController);
router.put('/:cartId', updateCartController);
router.delete('/:cartId', removeCartController);

export default router;