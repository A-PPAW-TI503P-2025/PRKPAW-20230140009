const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");

// Impor Router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");


// ===================================
// Middleware (Application-level)
// ===================================

// 1. Third-party Middleware
app.use(cors());        // Mengizinkan akses lintas-domain (CORS)
app.use(express.json()); // Built-in: Parsing body JSON
app.use(morgan("dev")); // Third-party: Logging request

// 2. Custom Application-level Middleware
app.use((req, res, next) => {
    // Log setiap request yang masuk
    console.log(`[${new Date().toISOString()}] - ${req.method} ${req.url}`);
    next();
});

// 3. Home Route
app.get("/", (req, res) => {
    res.send("Home Page for API. Coba akses /api/presensi/check-in atau /api/reports/daily");
});

// ===================================
// Routing
// ===================================


app.use("/api/presensi", presensiRoutes); // Gunakan Router Presensi
app.use("/api/reports", reportRoutes);  // Gunakan Router Laporan

// ===================================
// Menjalankan Server
// ===================================

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});