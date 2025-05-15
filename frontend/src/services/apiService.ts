// apiService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const loginUser = async (email: string, password: string) => {
    return axios.post(`${API_URL}/auth/login`, {
        email,
        password,
    });
};

const getCategories = async () => {
    return axios.get(`${API_URL}/categories`);
};

const getProductsByCategory = async (categoryName: string) => {
    return axios.get(
        `${API_URL}/categories/${encodeURIComponent(categoryName)}`
    );
};

const getProductById = async (productId: string) => {
    return axios.get(`${API_URL}/products/${productId}`);
};

const getHotProducts = async () => {
    return axios.get(`${API_URL}/products/hot`);
};

const getLatestProducts = async () => {
    return axios.get(`${API_URL}/products/latest`);
};

const addWishlist = async (productId: string, token: string) => {
    return axios.post(
        `${API_URL}/wishlist`,
        { productId },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

const getWishlist = async (token: string) => {
    return axios.get(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const removeWishlistItem = async (productId: string, token: string) => {
    return axios.delete(`${API_URL}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const getAddresses = async (token: string) => {
    return axios.get(`${API_URL}/address`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

interface AddressData {
    recipient: string;
    label: string;
    province: string;
    city: string;
    subdistrict: string;
    village: string;
    zipCode: string;
    fullAddress: string;
    isDefault: boolean;
}

const updateAddress = async (
    addressId: string,
    addressData: AddressData,
    token: string
) => {
    return axios.put(`${API_URL}/address/${addressId}`, addressData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const deleteAddress = async (addressId: string, token: string) => {
    return axios.delete(`${API_URL}/address/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export default {
    loginUser,
    getCategories,
    getProductsByCategory,
    getProductById,
    getHotProducts,
    getLatestProducts,
    addWishlist,
    getWishlist,
    removeWishlistItem,
    getAddresses,
    updateAddress,
    deleteAddress,
};
