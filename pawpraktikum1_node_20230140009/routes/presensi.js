const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware'); 

const { validateUpdatePresensi } = require('../middleware/validationMiddleware'); 


router.post('/check-in', authenticateToken, presensiController.CheckIn);
router.post('/check-out', authenticateToken, presensiController.CheckOut);
router.delete('/:id', authenticateToken, presensiController.deletePresensi);

router.put(
    "/:id", 
    authenticateToken,
    validateUpdatePresensi, 
    presensiController.updatePresensi
);

module.exports = router;