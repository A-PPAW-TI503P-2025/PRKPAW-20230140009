const { body, validationResult } = require('express-validator');

/**
 * Middleware untuk menangani hasil validasi
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Kesalahan Validasi Input', 
            errors: errors.array() 
        });
    }
    next();
};


/**
 * Aturan validasi untuk endpoint PUT /api/presensi/:id
 * Memastikan 'checkIn' dan 'checkOut' adalah format tanggal yang valid (ISO 8601).
 * Menggunakan .optional() agar field tidak wajib dikirim, tetapi jika dikirim, harus valid.
 */
exports.validateUpdatePresensi = [
    // 1. Validasi waktuCheckIn
    body('waktuCheckIn')
        .optional() // Tidak wajib ada di body
        .isISO8601() // Memastikan format adalah tanggal/waktu ISO 8601 (Contoh: "2025-10-29T08:00:00Z")
        .withMessage('Format waktuCheckIn tidak valid. Gunakan format tanggal/waktu ISO 8601.'),

    // 2. Validasi waktuCheckOut
    body('waktuCheckOut')
        .optional() // Tidak wajib ada di body
        .isISO8601() // Memastikan format adalah tanggal/waktu ISO 8601
        .withMessage('Format waktuCheckOut tidak valid. Gunakan format tanggal/waktu ISO 8601.'),

    // 3. Menangani error validasi
    handleValidationErrors
];