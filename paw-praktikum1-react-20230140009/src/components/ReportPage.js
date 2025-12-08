import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Base URL server tempat foto disimpan
const BASE_URL = "http://localhost:3001";

function ReportPage() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    
    // --- TAMBAHAN: State untuk Modal Foto ---
    const [modalImage, setModalImage] = useState(null); // Menyimpan URL foto yang akan ditampilkan di modal

    const fetchReports = async (query) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const url = query
                ? `${BASE_URL}/api/reports?search=` + encodeURIComponent(query)
                : `${BASE_URL}/api/reports`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Gagal mengambil data laporan");
            }
            const data = await response.json();
            setReports(data.data || []);
            setError(null);
        } catch (err) {
            setError(err.message || "Terjadi kesalahan saat mengambil data laporan");
            setReports([]);
        }
    };

    useEffect(() => {
        fetchReports("");
    }, [navigate]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchReports(searchTerm);
    };

    // --- FUNGSI BARU: Menampilkan Modal Foto ---
    const openModal = (photoPath) => {
        // Gabungkan Base URL server dengan path foto yang didapat dari DB (contoh: uploads/1-12345.jpg)
        const fullUrl = `${BASE_URL}/${photoPath}`;
        setModalImage(fullUrl);
    };

    const closeModal = () => {
        setModalImage(null);
    };
    // ----------------------------------------

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
            <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-4xl text-center"> 
                <h1 className="text-3xl font-bold text-blue-700 mb-6">
                    Laporan Presensi Harian
                </h1>

                <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2 justify-center">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        style={{ maxWidth: 300 }}
                    />
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
                    >
                        Cari
                    </button>
                </form>

                {error && (
                    <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
                )}

                {!error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg">
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Nama</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Check-In</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Check-Out</th>
                                    {/* --- TAMBAHAN: KOLOM BUKTI FOTO --- */}
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Bukti Foto</th>
                                    {/* ----------------------------------- */}
                                </tr>
                            </thead>
                            <tbody>
                                {reports.length > 0 ? (
                                    reports.map((presensi) => (
                                        <tr key={presensi.id} className="border-t">
                                            <td className="px-4 py-2 text-sm text-gray-900">{presensi.nama || "N/A"}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">
                                                {new Date(presensi.checkIn).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-500">
                                                {presensi.checkOut
                                                    ? new Date(presensi.checkOut).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
                                                    : "Belum Check-Out"}
                                            </td>
                                            {/* --- TAMBAHAN: TAMPILAN THUMBNAIL FOTO --- */}
                                            <td className="px-4 py-2 text-sm text-gray-500">
                                                {presensi.buktiFoto ? (
                                                    <img
                                                        src={`${BASE_URL}/${presensi.buktiFoto}`} // URL FOTO DARI SERVER
                                                        alt="Bukti Selfie"
                                                        className="w-16 h-16 object-cover cursor-pointer rounded-md border hover:opacity-80 transition"
                                                        onClick={() => openModal(presensi.buktiFoto)}
                                                    />
                                                ) : (
                                                    "Tidak ada"
                                                )}
                                            </td>
                                            {/* ------------------------------------------ */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                                            Tidak ada data yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- TAMBAHAN: KOMPONEN MODAL FOTO --- */}
            {modalImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={closeModal} // Tutup modal ketika mengklik latar belakang
                >
                    <div className="relative max-w-4xl max-h-full overflow-auto" onClick={e => e.stopPropagation()}>
                        <button 
                            className="absolute top-2 right-2 text-white text-3xl font-bold bg-gray-800 rounded-full w-10 h-10 hover:bg-gray-700"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <img 
                            src={modalImage} 
                            alt="Bukti Selfie Ukuran Penuh" 
                            className="w-full h-auto max-h-screen object-contain" 
                            style={{ transform: 'scaleX(-1)' }}
                        />
                    </div>
                </div>
            )}
            {/* ----------------------------------- */}
        </div>
    );
}

export default ReportPage;