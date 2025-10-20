const presensiRecords = require("../data/presensiData");

exports.getDailyReport = (req, res) => {
    // Controller ini hanya akan dieksekusi jika middleware isAdmin berhasil
    console.log("Controller: Mengambil data laporan harian dari array...");
    
    res.json({
        reportDate: new Date().toLocaleDateString('id-ID'),
        requestedByUser: req.user.nama,
        data: presensiRecords,
        message: "Laporan berhasil diambil (Akses Admin Diberikan)"
    });
};
