import {
    addToCart,
    getCartByUser,
    updateCartQuantity,
    removeFromCart,
} from "../services/cart.service.js";

export const addCartController = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        const cart = await addToCart(userId, productId, quantity);
        res.status(201).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menambahkan ke cart" });
    }
};

export const getCartController = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await getCartByUser(userId);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil cart" });
    }
};

export const updateCartController = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { quantity } = req.body;

        const updatedCart = await updateCartQuantity(cartId, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal update quantity cart" });
    }
};

export const removeCartController = async (req, res) => {
    try {
        const { cartId } = req.params;

        await removeFromCart(cartId);
        res.json({ message: "Item berhasil dihapus dari cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menghapus item dari cart" });
    }
};
