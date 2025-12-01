const { Presensi, User } = require("../models"); // Tambahkan import User jika ingin menampilkan nama
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

// --- FUNGSI CHECKIN ---
exports.CheckIn = async (req, res) => {
    try {
        const { id: userId, nama: userName } = req.user; 
        const { latitude, longitude } = req.body; 
        
        // 1. Tentukan waktu sekarang (DIPINDAH KE ATAS)
        const waktuSekarang = new Date(); 

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Latitude dan Longitude wajib disertakan." });
        }

        // 2. Cek apakah pengguna sudah memiliki catatan check-in yang aktif (DIPINDAH KE ATAS)
        const existingRecord = await Presensi.findOne({
            where: { userId: userId, checkOut: null },
        });

        if (existingRecord) {
            return res
                .status(400)
                .json({ message: "Anda sudah melakukan check-in hari ini." });
        }
        
        // 3. Buat record baru (Hanya jika tidak ada duplikasi)
        const newRecord = await Presensi.create({
            userId: userId,
            checkIn: waktuSekarang, // <-- Sekarang 'waktuSekarang' sudah didefinisikan
            latitude: latitude, 
            longitude: longitude, 
        });

        const formattedData = {
            id: newRecord.id,
            userId: newRecord.userId,
            checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
            checkOut: null,
            latitude: newRecord.latitude,
            longitude: newRecord.longitude,
        };

        res.status(201).json({
            message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
                waktuSekarang,
                "HH:mm:ss",
                { timeZone }
            )} WIB`,
            data: formattedData,
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// --- FUNGSI CHECKOUT ---
exports.CheckOut = async (req, res) => {
    try {
        // Ambil ID dari payload JWT (req.user)
        const { id: userId, nama: userName } = req.user; 
        const waktuSekarang = new Date();

        const recordToUpdate = await Presensi.findOne({
            where: { userId: userId, checkOut: null },
        });

        if (!recordToUpdate) {
            return res.status(404).json({
                message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
            });
        }

        recordToUpdate.checkOut = waktuSekarang;
        await recordToUpdate.save();

        const formattedData = {
            id: recordToUpdate.id,
            userId: recordToUpdate.userId,
            checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
            checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
            latitude: recordToUpdate.latitude,
            longitude: recordToUpdate.longitude,
        };

        res.json({
            message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
                waktuSekarang,
                "HH:mm:ss",
                { timeZone }
            )} WIB`,
            data: formattedData,
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    };
};

// --- FUNGSI DELETE PRESENSI (userId check sudah benar) ---
exports.deletePresensi = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const presensiId = req.params.id;
        const recordToDelete = await Presensi.findByPk(presensiId);

        if (!recordToDelete) {
        return res
            .status(404)
            .json({ message: "Catatan presensi tidak ditemukan." });
        }
        // Pastikan hanya pemilik yang bisa menghapus
        if (recordToDelete.userId !== userId) {
        return res
            .status(403)
            .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
        }

        await recordToDelete.destroy();
        res.status(200).json({ 
        message: `Catatan presensi dengan ID ${presensiId} berhasil dihapus.`,
        deletedId: presensiId
    });
    } catch (error) {
        res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// --- FUNGSI UPDATE PRESENSI (Hapus 'nama' jika tidak diperlukan di update) ---
exports.updatePresensi = async (req, res) => {
    try {
        const presensiId = req.params.id;
        // Hapus 'nama' dari destructuring req.body jika Anda tidak lagi menyimpannya
        // Jika nama masih ada, pastikan tidak mengubahnya karena nama harusnya dari tabel User
        const { checkIn, checkOut, latitude, longitude } = req.body; 
        
        // Buat objek updateData untuk menghindari update kolom 'nama'
        const updateData = {};
        if (checkIn !== undefined) updateData.checkIn = checkIn;
        if (checkOut !== undefined) updateData.checkOut = checkOut;
        if (latitude !== undefined) updateData.latitude = latitude;
        if (longitude !== undefined) updateData.longitude = longitude;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Request body tidak berisi data yang valid untuk diupdate.",
            });
        }
        
        const recordToUpdate = await Presensi.findByPk(presensiId);
        if (!recordToUpdate) {
            return res
                .status(404)
                .json({ message: "Catatan presensi tidak ditemukan." });
        }

        // Lakukan update
        await recordToUpdate.update(updateData);

        res.json({
            message: "Data presensi berhasil diperbarui.",
            data: recordToUpdate,
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};