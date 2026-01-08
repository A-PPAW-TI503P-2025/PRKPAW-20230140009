// routes/iot.js
const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');

// 1. Endpoint untuk menerima data dari alat (ESP32/Arduino)
// URL: POST http://localhost:3001/api/iot/data
router.post('/data', iotController.receiveSensorData);

// 2. Endpoint untuk tes koneksi
// URL: POST http://localhost:3001/api/iot/ping
router.post('/ping', iotController.testConnection);

// 3. Endpoint untuk mengambil history data ke Dashboard (React)
// URL: GET http://localhost:3001/api/iot/history
router.get('/history', iotController.getSensorHistory);

// EKSPOR HANYA SEKALI DI AKHIR FILE
module.exports = router;