const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');


const { validateUpdatePresensi } = require('../middleware/validationMiddleware'); 

router.use(addUserData);

router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
router.delete('/:id', presensiController.deletePresensi);


router.put(
    "/:id", 
    validateUpdatePresensi, 
    presensiController.updatePresensi
);

module.exports = router;