import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
} from "../services/auth.service.js";

export const registerController = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;
        const user = await registerUser(name, email, phoneNumber, password);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

export const getUserProfileController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const user = await getUserProfile(userId);
        res.json(user);
    } catch (err) {
        res.status(500).json({
            error: err.message || "Gagal mengambil data profil",
        });
    }
};

export const updateUserProfileController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const updatedUser = await updateUserProfile(userId, req.body);
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({
            error: err.message || "Gagal memperbarui profil",
        });
    }
};
