import {
    getAllCategories,
    getProductsByCategory,
} from "../services/category.service.js";

// Controller ambil semua kategori
export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await getAllCategories();

        const formattedCategories = categories.map((category) => ({
            id: category.id,
            name: category.name,
            imageUrl: category.imageUrl,
            productCount: category._count.products, // ambil jumlah produk
        }));

        res.json(formattedCategories);
    } catch (err) {
        console.error("Error saat mengambil kategori:", err.message);
        res.status(500).json({ error: "Gagal mengambil data kategori" });
    }
};

export const getProductsByCategoryController = async (req, res) => {
    try {
        const { categoryName } = req.params;

        const products = await getProductsByCategory(categoryName);

        if (products.length === 0) {
            return res
                .status(404)
                .json({ error: "Tidak ada produk di kategori ini" });
        }

        res.json(products);
    } catch (err) {
        res.status(500).json({
            error: "Gagal mengambil produk berdasarkan kategori",
        });
    }
};
