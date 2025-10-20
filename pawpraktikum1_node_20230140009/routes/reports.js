const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { addUserData, isAdmin } = require('../middleware/permissionMiddleware');

// Endpoint Laporan Harian: menggunakan array middleware [addUserData, isAdmin]
// isAdmin akan mencegah akses jika role user bukan 'admin'
router.get('/daily', [addUserData, isAdmin], reportController.getDailyReport);

module.exports = router; // <--- WAJIB ADA! Ini yang diekspor ke server.js
