import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 

    try {
      
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      // Perhatian: Penggunaan localStorage di React di lingkungan Canvas tidak disarankan,
      // tetapi digunakan di sini sesuai kebutuhan otentikasi.
      localStorage.setItem('token', token); 

      navigate('/dashboard');

    } catch (err) {
      // Tangani error dari server
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-sm text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Login</h2>
        <p className="text-center mb-8 text-blue-400 text-sm font-light tracking-widest">
          Silakan login untuk masuk
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan email Anda"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 uppercase tracking-widest"
          >
            Masuk
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 p-3 mt-6 rounded-md">
            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Belum punya akun?
            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium ml-1">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;