import prisma from '../lib/prisma.js';

export const addToWishlist = async (userId, productId) => {
  return await prisma.wishlist.create({
    data: {
      userId,
      productId,
    },
  });
};

export const getWishlistByUser = async (userId) => {
  return await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: { images: true, category: true },
      },
    },
  });
};

export const removeFromWishlist = async (userId, productId) => {
  return await prisma.wishlist.deleteMany({
    where: {
      userId,
      productId,
    },
  });
};