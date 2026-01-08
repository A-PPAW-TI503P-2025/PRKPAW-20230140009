require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// 1. Impor koneksi database
const db = require("./models");

// 2. Impor rute
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const ruteBuku = require("./routes/books");
const authRoutes = require("./routes/auth");
const iotRoutes = require("./routes/iot");

// --- 3. MIDDLEWARE (WAJIB DI ATAS SEMUA ROUTES) ---
app.use(cors()); // Pindahkan ke paling atas agar semua rute dapat izin
app.use(express.json());
app.use(morgan("dev"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 4. ROUTES (DAFTARKAN SETELAH MIDDLEWARE) ---
app.use("/api/iot", iotRoutes);
app.use('/api/attendance', presensiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);

app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// --- 5. SINKRONISASI DB & JALANKAN SERVER ---
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database berhasil tersinkronisasi (altered).");
    app.listen(PORT, () => {
      console.log(`Express server running at http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("Gagal sinkronisasi database:", err);
  });