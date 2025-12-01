const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController'); 
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware'); 

// Route lama
router.get('/daily', authenticateToken, isAdmin, reportController.getDailyReport);

// Route baru agar /api/reports bisa diakses dari frontend
router.get('/', authenticateToken, isAdmin, reportController.getDailyReport);

module.exports = router;