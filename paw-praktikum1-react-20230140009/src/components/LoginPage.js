import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      localStorage.setItem('token', token); 

      navigate('/dashboard');

    } catch (err) {
      // 4. Tangani error dari server
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* Container utama dengan background gelap dan border neon effect */}
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-sm border-t-4 border-cyan-400">
        
        <h2 className="text-4xl font-extrabold text-center mb-2 text-white">
          LOGIN MOAL?
        </h2>
        <p className="text-center mb-8 text-cyan-400 text-sm font-light tracking-widest">
            SILAHKAN LOGIN DULU
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
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
              placeholder="Masukkan email Anda"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition duration-150"
            />
          </div>
          
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
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-cyan-500 text-gray-900 font-bold rounded-md shadow-lg hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-200 uppercase tracking-widest"
          >
            Masuk
          </button>
        </form>
        
        {error && (
          <div className="bg-red-900 border border-red-500 p-3 mt-6 rounded-md">
            <p className="text-red-300 text-sm font-medium text-center">{error}</p>
          </div>
        )}
        
        <div className="text-center mt-6">
            <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                Lupa Kata Sandi?
            </a>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;