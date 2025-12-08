// routes/presensi.js

const express = require('express');
const router = express.Router();

// IMPORT CONTROLLER AS A SINGLE OBJECT
const presensiController = require('../controllers/presensiController'); 

const { authenticateToken } = require('../middleware/permissionMiddleware'); 
const { validateUpdatePresensi } = require('../middleware/validationMiddleware'); 


// Use presensiController.upload and presensiController.CheckIn
router.post('/check-in', [authenticateToken, presensiController.upload.single('image')], presensiController.CheckIn);

router.post('/check-out', authenticateToken, presensiController.CheckOut);
router.delete('/:id', authenticateToken, presensiController.deletePresensi);

router.put(
    "/:id", 
    authenticateToken,
    validateUpdatePresensi, 
    presensiController.updatePresensi
);

module.exports = router;