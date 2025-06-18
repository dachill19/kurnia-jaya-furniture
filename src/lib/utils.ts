import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const translateSupabaseError = (message: string): string => {
    const translations: Record<string, string> = {
        // Auth
        "Invalid login credentials": "Email atau kata sandi salah.",
        "Email not confirmed":
            "Email belum dikonfirmasi. Silakan cek kotak masuk Anda.",
        "User already registered": "Akun dengan email ini sudah terdaftar.",
        "Signup requires a valid password": "Kata sandi tidak valid.",
        "Password should be at least 6 characters":
            "Kata sandi harus memiliki minimal 6 karakter.",
        "Email not found": "Email tidak ditemukan.",
        "Email rate limit exceeded":
            "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.",
        "User not found": "Pengguna tidak ditemukan.",
        "Token has expired or is invalid": "Token kadaluarsa atau tidak valid.",
        "Unable to validate email address: invalid format":
            "Format email tidak valid.",

        // OTP / magic link
        "Email link is invalid or has expired":
            "Tautan email tidak valid atau telah kedaluwarsa.",
        "OTP has expired": "Kode OTP telah kedaluwarsa.",
        "OTP is incorrect": "Kode OTP salah.",

        // Network / general
        "Network error":
            "Terjadi kesalahan jaringan. Periksa koneksi internet Anda.",
        "Fetch failed": "Gagal mengambil data. Periksa koneksi Anda.",
        "Unexpected error": "Terjadi kesalahan yang tidak terduga.",
        "Invalid login credentials.": "Email atau kata sandi salah.",

        // Default fallback
        default: "Terjadi kesalahan. Silakan coba lagi nanti.",
    };

    return translations[message.trim()] || translations["default"];
};
