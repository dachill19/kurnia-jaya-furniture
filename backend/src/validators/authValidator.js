import { body } from "express-validator";

export const registerValidation = [
    body("name").notEmpty().withMessage("Nama tidak boleh kosong"),
    body("email").isEmail().withMessage("Email tidak valid"),
    body("phoneNumber")
        .isMobilePhone("id-ID")
        .withMessage("Nomor telepon tidak valid"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password minimal 6 karakter"),
];

export const loginValidation = [
    body("email").isEmail().withMessage("Email tidak valid"),
    body("password").notEmpty().withMessage("Password wajib diisi"),
];
