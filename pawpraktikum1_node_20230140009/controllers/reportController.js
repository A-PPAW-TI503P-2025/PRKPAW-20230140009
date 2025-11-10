const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
    try {
        const { nama, tanggalMulai, tanggalSelesai } = req.query; 
        let options = { where: {} };

        // --- 1. Filter berdasarkan Nama ---
        if (nama) {
            options.where.nama = {
                [Op.like]: `%${nama}%`,
            };
        }

        // --- 2. Filter berdasarkan Rentang Tanggal (createdAt ATAU updatedAt) ---
        if (tanggalMulai && tanggalSelesai) {
            
            // a. Hitung Awal Hari (00:00:00) dari tanggalMulai
            const startDate = new Date(tanggalMulai);
            startDate.setHours(0, 0, 0, 0);

            // b. Hitung Akhir Hari (23:59:59.999) dari tanggalSelesai
            const endDate = new Date(tanggalSelesai);
            endDate.setHours(23, 59, 59, 999); 

            // Definisikan kondisi rentang tanggal untuk kedua kolom
            const dateRangeCondition = {
                [Op.between]: [startDate, endDate],
            };

            // Terapkan filter [Op.or] pada tingkat teratas options.where
            // untuk menggabungkan dua kondisi: createdAt dalam rentang ATAU updatedAt dalam rentang.
            options.where[Op.or] = [
                { createdAt: dateRangeCondition },
                { updatedAt: dateRangeCondition }
            ];
            
            // --- Penanganan Filter Nama dan Tanggal ---
            // Jika ada filter nama, kita harus menggabungkan kondisi nama dan kondisi OR tanggal dengan [Op.and].
            if (options.where.nama) {
                const namaCondition = options.where.nama;
                const orCondition = options.where[Op.or];
                
                // Hapus filter nama dan OR dari options.where
                delete options.where.nama;
                delete options.where[Op.or];

                // Gabungkan semua kondisi dengan AND
                options.where[Op.and] = [
                    { nama: namaCondition },
                    { [Op.or]: orCondition }
                ];
            }
        }
        
        // --- 3. Ambil data dari database ---
        const records = await Presensi.findAll(options);

        // --- 4. Kirim respons ---
        res.json({
            reportDate: new Date().toLocaleDateString(),
            data: records,
            query: { nama, tanggalMulai, tanggalSelesai }
        });
    } catch (error) {
        // --- 5. Tangani error ---
        res
            .status(500)
            .json({ message: "Gagal mengambil laporan", error: error.message });
    }
};