import { addToWishlist, getWishlistByUser, removeFromWishlist } from '../services/wishlist.service.js';

export const addWishlistController = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const wishlist = await addToWishlist(userId, productId);
    res.status(201).json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menambahkan ke wishlist' });
  }
};

export const getWishlistController = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await getWishlistByUser(userId);
    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil wishlist' });
  }
};

export const removeWishlistController = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    await removeFromWishlist(userId, productId);
    res.json({ message: 'Produk berhasil dihapus dari wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menghapus dari wishlist' });
  }
};