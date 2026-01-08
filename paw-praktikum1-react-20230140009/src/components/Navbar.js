import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return null; 

  return (
    <nav className="bg-white shadow-md rounded-b-lg px-8 py-4 flex justify-between items-center">
      <div className="font-bold text-xl text-blue-700">
        Halo, {user.nama}
      </div>
      <div className="flex items-center space-x-6">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">Dashboard</Link>
        <Link to="/presensi" className="text-blue-600 hover:text-blue-800 font-medium">Presensi</Link>
        
        {user.role === 'admin' && (
          <Link to="/reports" className="text-blue-600 hover:text-blue-800 font-medium">Laporan Admin</Link>
        )}
        <Link to="/monitoring" className="text-blue-600 hover:text-blue-800 font-medium">Monitoring Suhu</Link>
        <button
          onClick={handleLogout}
          className="ml-4 py-2 px-5 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;