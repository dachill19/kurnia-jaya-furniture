import {
    addAddress,
    updateAddress,
    deleteAddress,
    getAddresses,
    getAddressById,
} from "../services/address.service.js";

export const addAddressController = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = req.body;

        const address = await addAddress(userId, data);
        res.status(201).json({ success: true, address });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateAddressController = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        const data = req.body;

        const updated = await updateAddress(addressId, userId, data);
        res.status(200).json({ success: true, address: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;

        await deleteAddress(addressId, userId);
        res.status(200).json({ success: true, message: "Alamat dihapus" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAddressesController = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await getAddresses(userId);
        res.status(200).json({ success: true, addresses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAddressByIdController = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        const address = await getAddressById(addressId, userId);
        res.status(200).json({ success: true, address });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};
