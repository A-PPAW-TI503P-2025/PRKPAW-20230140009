import React, { useEffect, useState } from 'react';

const primaryColor = '#e94560'; 
const secondaryColor = '#0f3460'; 
const textColor = '#f0f0f0'; 
const darkBg = '#16213e'; 

const containerStyle = {
  fontFamily: '"Consolas", monospace', 
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: darkBg,
  color: textColor,
  padding: '40px',
};

const headerStyle = {
  fontSize: '2.8rem',
  fontWeight: '700',
  letterSpacing: '5px',
  marginBottom: '40px',
  color: primaryColor,
  textShadow: `0 0 10px ${primaryColor}, 0 0 20px rgba(233, 69, 96, 0.5)`, 
};

const inputStyle = {
  padding: '15px 25px',
  fontSize: '1.2rem',
  border: `2px solid ${primaryColor}`, 
  backgroundColor: secondaryColor,
  color: textColor,
  borderRadius: '5px',
  width: '350px',
  textAlign: 'center',
  marginBottom: '40px',
  boxShadow: `0 0 5px ${primaryColor}`, 
  transition: 'all 0.3s ease-in-out',
};

const messageStyle = {
  fontSize: '2.2rem',
  fontWeight: '400',
  color: textColor,
  height: '60px', 
  textShadow: `0 0 5px ${textColor}`,
};

const serverBoxStyle = {
  marginTop: '60px',
  padding: '30px 50px',
  border: `1px solid ${primaryColor}`, 
  backgroundColor: secondaryColor,
  borderRadius: '10px',
  boxShadow: `0 0 15px ${primaryColor}`,
  textAlign: 'center',
  width: '450px',
};

const serverHeaderStyle = {
  fontSize: '1.1rem',
  fontWeight: '300',
  color: primaryColor,
  marginBottom: '15px',
};

const serverMessageStyle = {
  fontSize: '1.8rem',
  fontWeight: 'bold',
  color: '#28a745', 
  textShadow: '0 0 8px rgba(40, 167, 69, 0.7)',
};

function App() {
  const [name, setName] = useState('');
  const [serverMessage, setServerMessage] = useState('Mengambil pesan...'); 

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  useEffect(() => {
    fetch('http://localhost:5000/') 
      .then(response => response.json())
      .then(data => setServerMessage(data.message))
      .catch(error => {
        console.error('Error fetching data:', error);
        setServerMessage('Gagal terhubung ke server!');
      });
  }, []); 

  return (
    <div style={containerStyle}>
      {}
      <h1 style={headerStyle}>
        WEB HELLO NAMA
      </h1>
      
      {}
      <input 
        type="text"
        placeholder="Masukkan nama Anda di sini..."
        value={name}
        onChange={handleNameChange}
        style={inputStyle}
      />
      
      {}
      <h2 style={messageStyle}>
        {name ? `>>> Hello, ${name} <<<` : '>>> Input Username <<<'}
      </h2>

      {}
      <div style={serverBoxStyle}>
        <p style={serverHeaderStyle}>
          SERVER STATUS [Node.js Backend]
        </p>
        <p style={serverMessageStyle}>
          {serverMessage}
        </p>
      </div>
      
    </div>
  );
}

export default App;