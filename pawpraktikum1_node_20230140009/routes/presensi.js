const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');

// Middleware di Level Router: addUserData akan dijalankan sebelum semua rute di router ini
router.use(addUserData); 

// Endpoint Check-in dan Check-out
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

module.exports = router; // <--- WAJIB ADA! Ini yang diekspor ke server.js
