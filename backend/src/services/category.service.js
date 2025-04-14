import prisma from "../lib/prisma.js";

// Get all categories
export const getAllCategories = async () => {
    return await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
};

// Get products by category
export const getProductsByCategory = async (categoryName) => {
    return await prisma.product.findMany({
        where: {
            category: {
                name: categoryName,
            },
        },
        include: {
            category: true,
            images: true,
        },
    });
};
