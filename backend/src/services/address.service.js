import prisma from "../lib/prisma.js";

export const addAddress = async (userId, data) => {
    if (data.isDefault) {
        await prisma.address.updateMany({
            where: { userId },
            data: { isDefault: false },
        });
    }

    return await prisma.address.create({
        data: {
            ...data,
            userId,
        },
    });
};

export const updateAddress = async (addressId, userId, data) => {
    const address = await prisma.address.findUnique({
        where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
        throw new Error("Alamat tidak ditemukan atau bukan milik Anda");
    }

    if (data.isDefault) {
        await prisma.address.updateMany({
            where: { userId },
            data: { isDefault: false },
        });
    }

    return await prisma.address.update({
        where: { id: addressId },
        data,
    });
};

export const deleteAddress = async (addressId, userId) => {
    const address = await prisma.address.findUnique({
        where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
        throw new Error("Alamat tidak ditemukan atau bukan milik Anda");
    }

    return await prisma.address.delete({
        where: { id: addressId },
    });
};

export const getAddresses = async (userId) => {
    return await prisma.address.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
};

export const getAddressById = async (addressId, userId) => {
    const address = await prisma.address.findUnique({
        where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
        throw new Error("Alamat tidak ditemukan atau bukan milik Anda");
    }

    return address;
};
