import prisma from "../lib/prisma.js";

// Get all products
export const getAllProducts = async () => {
    return await prisma.product.findMany({
        include: {
            category: true,
            images: true,
        },
    });
};

// Get product by ID
export const getProductById = async (id) => {
    return await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            images: true,
        },
    });
};

// Get hot products
export const getHotProducts = async () => {
    return await prisma.product.findMany({
        where: { isHot: true },
        include: { images: true },
    });
};

// Get latest products
export const getLatestProducts = async () => {
    return await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { images: true },
    });
};

// Get discounted products
export const getDiscountedProducts = async () => {
    return await prisma.product.findMany({
        where: {
            discountPrice: { not: null },
        },
        include: { images: true },
    });
};

// Get sorted products
export const getSortedProducts = async (sort) => {
    const orderBy =
        sort === "price_desc"
            ? { price: "desc" }
            : sort === "price_asc"
            ? { price: "asc" }
            : undefined;

    return await prisma.product.findMany({
        orderBy,
        include: { images: true },
    });
};

// Create product
export const createProduct = async (data) => {
    const {
        name,
        description,
        price,
        discountPrice,
        stock,
        categoryName,
        isHot,
        images,
    } = data;

    // Cek apakah kategori sudah ada
    let category = await prisma.category.findUnique({
        where: { name: categoryName },
    });

    // Kalau belum ada, buat dulu
    if (!category) {
        category = await prisma.category.create({
            data: { name: categoryName },
        });
    }

    // Buat produk
    return await prisma.product.create({
        data: {
            name,
            description,
            price,
            discountPrice,
            stock,
            isHot,
            category: { connect: { id: category.id } },
            images: {
                create: images.map((img) => ({
                    imageUrl: img.imageUrl,
                    isMain: img.isMain ?? false,
                })),
            },
        },
        include: {
            category: true,
            images: true,
        },
    });
};

// Update product
export const updateProduct = async (id, data) => {
    const {
        name,
        description,
        price,
        discountPrice,
        stock,
        categoryName,
        isHot,
        images,
    } = data;

    // Cari kategori berdasarkan nama
    let category = await prisma.category.findUnique({
        where: { name: categoryName },
    });

    // Kalau belum ada, buat baru
    if (!category) {
        category = await prisma.category.create({
            data: { name: categoryName },
        });
    }

    // Hapus images lama dulu
    await prisma.productImage.deleteMany({
        where: { productId: id },
    });

    // Update produk
    return await prisma.product.update({
        where: { id },
        data: {
            name,
            description,
            price,
            discountPrice,
            stock,
            isHot,
            category: { connect: { id: category.id } },
            images: {
                create: images.map((img) => ({
                    imageUrl: img.imageUrl,
                    isMain: img.isMain ?? false,
                })),
            },
        },
        include: {
            category: true,
            images: true,
        },
    });
};

// Delete product
export const deleteProduct = async (id) => {
    return await prisma.product.delete({
        where: { id },
    });
};
