import prisma from "../lib/prisma.js";

export const addToCart = async (userId, productId, quantity) => {
    const existingCartItem = await prisma.cart.findFirst({
        where: {
            userId,
            productId,
        },
    });

    if (existingCartItem) {
        return await prisma.cart.update({
            where: { id: existingCartItem.id },
            data: {
                quantity: existingCartItem.quantity + quantity,
            },
        });
    }

    return await prisma.cart.create({
        data: {
            userId,
            productId,
            quantity,
        },
    });
};

export const getCartByUser = async (userId) => {
    return await prisma.cart.findMany({
        where: { userId },
        include: {
            product: {
                include: { images: true, category: true },
            },
        },
    });
};

export const updateCartQuantityByProduct = async (
    userId,
    productId,
    quantity
) => {
    const existingCartItem = await prisma.cart.findFirst({
        where: {
            userId,
            productId,
        },
    });

    if (!existingCartItem) {
        throw new Error("Item tidak ditemukan dalam cart");
    }

    return await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity },
    });
};

export const removeFromCartByProduct = async (userId, productId) => {
    const existingCartItem = await prisma.cart.findFirst({
        where: {
            userId,
            productId,
        },
    });

    if (!existingCartItem) {
        throw new Error("Item tidak ditemukan dalam cart");
    }

    return await prisma.cart.delete({
        where: { id: existingCartItem.id },
    });
};

export const clearCart = async (userId) => {
    return await prisma.cart.deleteMany({
        where: { userId },
    });
};
