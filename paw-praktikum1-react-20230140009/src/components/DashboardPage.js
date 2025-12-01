import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Dashboard</h1>
        <p className="text-lg text-gray-700 mb-8">Selamat Datang di Halaman Dashboard Admin.</p>
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-red-500 text-white font-bold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-200 uppercase tracking-widest"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;