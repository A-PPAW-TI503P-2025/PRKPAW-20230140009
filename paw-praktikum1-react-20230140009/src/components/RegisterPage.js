import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  // --- PERUBAHAN 1: Mengubah state 'name' menjadi 'nama' ---
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa'); // Default role
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 

    try {
      // --- PERUBAHAN 2: Mengirim properti 'nama' ke backend ---
      await axios.post('http://localhost:3001/api/auth/register', {
        nama: nama, // Field dikirim sebagai 'nama'
        email: email,
        password: password,
        role: role,
      });

      // Setelah berhasil register, arahkan ke halaman login
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');

    } catch (err) {
      // Tangani error dari server
      // Jika berhasil di-catch, pesan spesifik dari server (misalnya "Email sudah terdaftar.") akan muncul.
      setError(err.response ? err.response.data.message : 'Registrasi gagal (Cek koneksi server).');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* Container utama dengan background gelap dan border neon effect (cyan) */}
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-cyan-400">
        
        <h2 className="text-4xl font-extrabold text-center mb-2 text-white">
          DAFTAR AKUN
        </h2>
        <p className="text-center mb-8 text-cyan-400 text-sm font-light tracking-widest">
            NEW USER REGISTRATION
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Field Nama */}
          <div>
            <label 
              htmlFor="nama" // htmlFor tetap saya ganti ke 'nama' untuk konsistensi
              className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider"
            >
              Nama Lengkap
            </label>
            <input
              id="nama"
              type="text"
              value={nama}
              // --- PERUBAHAN 3: Menggunakan setNama ---
              onChange={(e) => setNama(e.target.value)}
              required
              placeholder="Masukkan nama Anda"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition duration-150"
            />
          </div>

          {/* 2. Field Email (TIDAK BERUBAH) */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="contoh@domain.com"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition duration-150"
            />
          </div>
          
          {/* 3. Field Password (TIDAK BERUBAH) */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition duration-150"
            />
          </div>
          
          {/* 4. Field Role (TIDAK BERUBAH) */}
          <div>
            <label 
              htmlFor="role" 
              className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition duration-150 appearance-none"
            >
                <option value="mahasiswa">Mahasiswa</option>
                <option value="admin">Admin</option>
            </select>
            {/* Arrow kustom untuk select box agar tetap senada dengan dark mode */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-cyan-500 text-gray-900 font-bold rounded-md shadow-lg hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-200 uppercase tracking-widest mt-6"
          >
            Daftar
          </button>
        </form>
        
        {error && (
          <div className="bg-red-900 border border-red-500 p-3 mt-6 rounded-md">
            <p className="text-red-300 text-sm font-medium text-center">{error}</p>
          </div>
        )}
        
        <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
                Sudah punya akun? 
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium ml-1">
                    Login di sini
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;