const { Presensi, User } = require("../models"); // Import model User
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
    try {
        const { nama, tanggalMulai, tanggalSelesai } = req.query; 
        
        let options = { 
            where: {}, 
            // Sertakan (Include) model User untuk mendapatkan data nama
            include: [{
                model: User, // Model yang direlasikan
                as: 'user',  // Alias yang didefinisikan di model Presensi (as: 'user')
                attributes: ['nama'], // Hanya ambil kolom nama
                required: true // Gunakan INNER JOIN agar hanya mengambil record yang punya User
            }],
            order: [['createdAt', 'DESC']] // Urutkan berdasarkan waktu terbaru
        };

        // --- 1. Filter berdasarkan Nama (Difilter di tabel User) ---
        if (nama) {
            options.include[0].where = {
                nama: {
                    [Op.like]: `%${nama}%`,
                },
            };
        }

        // --- 2. Filter berdasarkan Rentang Tanggal ---
        if (tanggalMulai && tanggalSelesai) {
            
            const startDate = new Date(tanggalMulai);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(tanggalSelesai);
            endDate.setHours(23, 59, 59, 999); 

            // Definisikan kondisi rentang tanggal untuk kolom checkIn (atau createdAt)
            options.where.checkIn = {
                [Op.between]: [startDate, endDate],
            };
            
            // Logika [Op.or] di kode Anda sebelumnya rumit dan berpotensi error karena mencampur filter
            // pada kolom yang berbeda. Lebih baik memfilter berdasarkan kolom checkIn yang paling relevan.
            
        }
        
        // --- 3. Ambil data dari database ---
        const records = await Presensi.findAll(options);
        
        // --- 4. Format data hasil query untuk menyederhanakan output ---
        const formattedRecords = records.map(record => ({
            id: record.id,
            nama: record.user.nama, // Ambil nama dari relasi
            checkIn: record.checkIn,
            checkOut: record.checkOut,
            latitude: record.latitude, // Sertakan data lokasi
            longitude: record.longitude, // Sertakan data lokasi
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        }));

        // --- 5. Kirim respons ---
        res.json({
            reportDate: new Date().toLocaleDateString(),
            data: formattedRecords,
            query: { nama, tanggalMulai, tanggalSelesai }
        });
    } catch (error) {
        // --- 6. Tangani error ---
        console.error("Error fetching daily report:", error);
        res
            .status(500)
            .json({ message: "Gagal mengambil laporan", error: error.message });
    }
};