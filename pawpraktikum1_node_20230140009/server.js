require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // Logger yang lebih baik
const app = express();
const PORT = process.env.PORT || 3001; // Gunakan env port jika ada

// --- 1. Impor koneksi database (PENTING) ---
// Ini mengimpor koneksi Sequelize dari folder /models
const db = require("./models");

// --- 2. Kumpulkan semua impor rute di satu tempat ---
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const ruteBuku = require("./routes/books");
const authRoutes = require("./routes/auth");
const path = require('path'); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware
app.use(cors()); // Mengizinkan Cross-Origin Resource Sharing
app.use(express.json()); // Mem-parsing body JSON dari request
app.use(morgan("dev")); 
app.use('/api/attendance', presensiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);
// --- 3. Logger manual Anda dihapus ---
// (Karena 'morgan' sudah melakukan hal yang sama dengan lebih baik)
// app.use((req, res, next) => {
//   console.log(${new Date().toISOString()} - ${req.method} ${req.url});
//   next();
// });

// Routes
app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// Daftarkan semua rute API Anda
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

// --- 4. Sinkronkan Database dan Jalankan Server (PERBAIKAN UTAMA) ---
// Ini akan menjalankan db.sequelize.sync() SEBELUM server Penuh.
// {alter: true} akan mencocokkan model Anda dengan tabel di database
// tanpa menghapus data yang ada.
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database berhasil tersinkronisasi (altered).");
    
    // Jalankan server HANYA JIKA database sudah siap
    app.listen(PORT, () => {
      console.log(`Express server running at http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("Gagal sinkronisasi database:", err);
  });