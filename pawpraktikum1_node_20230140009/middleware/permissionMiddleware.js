// Middleware untuk menambahkan data user dummy ke request
exports.addUserData = (req, res, next) => {
    console.log('Middleware: Menambahkan data user dummy...');
    
    // UBAH 'karyawan' menjadi 'admin' di sini untuk mencoba akses laporan (GET /api/reports/daily)
    req.user = {
        id: 123,
        nama: 'User Karyawan',
        role: 'admin' 
    };
    next(); 
};

// Middleware untuk memverifikasi apakah user adalah admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        console.log('Middleware: Izin admin diberikan.');
        next(); 
    } else {
        console.log('Middleware: Gagal! Pengguna bukan admin.');
        // Mengirim respons 403 (Forbidden)
        return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin'});
    }
};
