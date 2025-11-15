import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();
  // State dummy untuk informasi user, biasanya diambil dari API setelah login
  const [userName, setUserName] = useState('Pengguna Berhasil Login'); 
  const [userRole, setUserRole] = useState('Mahasiswa'); 
  const [loading, setLoading] = useState(true);

  // Simulasi pengambilan data user dan token verification (Proteksi Rute)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Jika tidak ada token, paksa kembali ke login
      console.log('Token tidak ditemukan, mengarahkan ke halaman login.');
      navigate('/login');
    } else {
      // Di aplikasi nyata, Anda akan melakukan fetch('/api/user/profile') di sini
      // untuk mendapatkan nama dan role berdasarkan token.
      setTimeout(() => {
        // Contoh data dummy:
        setUserName('Harlan Fadhilah'); 
        setUserRole('Mahasiswa'); 
        setLoading(false);
      }, 500);
    }
  }, [navigate]);

  /**
   * Fungsi untuk menangani proses Logout.
   * 1. Menghapus token dari local storage.
   * 2. Mengarahkan pengguna ke halaman /login.
   */
  const handleLogout = () => {
    localStorage.removeItem('token'); // 1. Hapus token dari local storage
    console.log('Token dihapus. Logout berhasil.');
    navigate('/login'); // 2. Arahkan ke halaman login
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-cyan-400 text-xl">Memuat Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="text-white p-6 font-sans"
        style={{ backgroundColor: '#234C6A' }}>
      
      {/* --- Header Dashboard (Navigasi & Logout) --- */}
      <header className="flex justify-between items-center py-4 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-cyan-300 tracking-wider">
          {userRole === 'Admin' ? 'ADMIN PANEL' : 'DASHBOARD PENGGUNA'}
        </h1>
        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 uppercase text-sm flex items-center"
        >
          {/* Mengganti i tag dengan SVG icon (karena Font Awesome tidak terload otomatis) */}
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-4a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </header>
      
      {/* --- Greeting Card --- */}
      <div className="mt-8 bg-gray-900 p-8 rounded-xl shadow-lg border-l-4 border-cyan-500">
        <p className="text-sm text-gray-400 mb-1">Selamat datang kembali,</p>
        <h2 className="text-4xl font-bold mb-4">
          {userName}
        </h2>
        <div className="inline-block bg-cyan-600/20 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
            Role: {userRole}
        </div>
      </div>

      {/* --- Dashboard Content/Widgets --- */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Status */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-cyan-600/30 transition duration-300">
          <h3 className="text-xl font-semibold mb-3 text-cyan-400">Status Akun</h3>
          <p className="text-gray-300">Akun Anda aktif dan terverifikasi. Semua layanan tersedia.</p>
        </div>

        {/* Widget 2: Data Terbaru */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-cyan-600/30 transition duration-300">
          <h3 className="text-xl font-semibold mb-3 text-cyan-400">Pembaruan Sistem</h3>
          <p className="text-gray-300">Versi terbaru telah diterapkan pada 15 Nov 2025.</p>
        </div>
        
        {/* Widget 3: Akses Cepat */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-cyan-600/30 transition duration-300">
          <h3 className="text-xl font-semibold mb-3 text-cyan-400">Akses Cepat</h3>
          <button className="text-sm bg-cyan-600/50 hover:bg-cyan-600 px-4 py-2 rounded-md transition duration-150 text-white">
            Lihat Profil
          </button>
        </div>

      </div>

      {/* --- Footer --- */}
      <footer className="text-center mt-12 text-gray-200 text-sm border-t border-gray-200 pt-4">
        &copy; 2025 Aplikasi PAW. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}

export default DashboardPage;