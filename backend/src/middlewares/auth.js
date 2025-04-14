import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Cek apakah ada header Authorization
    if (!token) {
        return res.status(401).json({ error: "Token tidak ditemukan" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token terverifikasi:", decoded); // debug di sini
        req.user = decoded; // Simpan data user dari token ke request
        next(); // Lanjut ke controller
    } catch (err) {
        return res.status(401).json({ error: "Token tidak valid" });
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res
            .status(403)
            .json({
                error: "Akses ditolak, hanya admin yang bisa mengakses ini",
            });
    }
    next();
};
