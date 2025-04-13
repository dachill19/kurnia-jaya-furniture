import { getAllProducts, getSortedProducts, getProductById, getProductsByCategory, getHotProducts, getLatestProducts, getDiscountedProducts, createProduct, updateProduct, deleteProduct } from '../services/product.service.js';

// Get all products
export const getAllProductsController = async (req, res) => {
  try {
    const { sort } = req.query;

    const products = sort
      ? await getSortedProducts(sort)
      : await getAllProducts();

    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get product by ID
export const getProductByIdController = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProductsByCategoryController = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const products = await getProductsByCategory(categoryName);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Tidak ada produk di kategori ini' });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil produk berdasarkan kategori' });
  }
};

export const getHotProductsController = async (req, res) => {
  try {
    const products = await getHotProducts();
    res.json(products);
  } catch (err) { 
    res.status(500).json({ error: "Gagal mengambil produk hot" });
  }
};

// Produk Terbaru
export const getLatestProductsController = async (req, res) => {
  try {
    const products = await getLatestProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil produk terbaru" });
  }
};

// Produk Diskon
export const getDiscountedProductsController = async (req, res) => {
  try {
    const products = await getDiscountedProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil produk diskon" });
  }
};

// Create product
export const createProductController = async (req, res) => {
  try {
    const { name, price, categoryName } = req.body;

    // Validasi input wajib
    if (!name || !price || !categoryName) {
      return res.status(400).json({ error: 'Field wajib tidak lengkap' });
    }

    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error('Error create product:', err);
    res.status(400).json({ error: err.message });
  }
};

// Update product
export const updateProductController = async (req, res) => {
  try {
    const updatedProduct = await updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete product
export const deleteProductController = async (req, res) => {
  try {
    const deletedProduct = await deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).json();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};