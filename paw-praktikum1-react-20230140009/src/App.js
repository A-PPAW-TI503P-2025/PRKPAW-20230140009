import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import Navbar from './components/Navbar';
import PresensiPage from './components/PresensiPage';
import ReportPage from './components/ReportPage';

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main className="p-4"> 
                 {children} 
            </main>
        </div>
    );
};

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* 1. Rute yang tidak perlu Navbar (Login/Register) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
        
        {/* 2. Rute yang memerlukan Navbar (Dashboard, Presensi, Report) */}
        <Routes>
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/presensi" element={<Layout><PresensiPage/></Layout>} />
          <Route path="/report" element={<Layout><ReportPage/></Layout>} />
          <Route path="/reports" element={<Layout><ReportPage/></Layout>} />
        </Routes>
        
      </div>
    </Router>
  );
}
export default App;