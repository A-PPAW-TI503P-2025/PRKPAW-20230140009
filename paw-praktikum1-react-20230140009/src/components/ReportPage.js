import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReports = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Gunakan URL backend secara eksplisit
      const url = query
        ? "http://localhost:3001/api/reports?search=" + encodeURIComponent(query)
        : "http://localhost:3001/api/reports";

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-2xl text-center">
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                      Tidak ada data yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;