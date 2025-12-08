import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Webcam from 'react-webcam'; 

// Fungsi pembantu untuk mengambil token dari LocalStorage
const getToken = () => localStorage.getItem("token");

function AttendancePage() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [coords, setCoords] = useState(null); 

    const [image, setImage] = useState(null); 
    const webcamRef = useRef(null); 
    
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc); 
    }, [webcamRef]);

    const getLocation = () => {
        // ... (Logika getLocation tetap sama)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude, 
                        lng: position.coords.longitude
                    });
                    setError(null);
                },
                (error) => {
                    setError("Gagal mendapatkan lokasi: " + error.message + ". Check-In memerlukan lokasi.");
                    setCoords(null);
                }
            );
        } else {
            setError("Geolocation tidak didukung oleh browser ini.");
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const handleCheckIn = async () => {
        setError(""); 
        setMessage(""); 
        
        if (!coords || !image) { 
            setError("Lokasi dan Foto wajib ada!");
            return;
        }

        try {
            const blob = await (await fetch(image)).blob();
            
            const formData = new FormData();
            formData.append('latitude', coords.lat);
            formData.append('longitude', coords.lng);
            formData.append('image', blob, 'selfie.jpg'); 

            const config = {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            };

            const response = await axios.post(
                "http://localhost:3001/api/presensi/check-in", 
                formData, 
                config
            );

            setMessage(response.data.message);
        } catch (err) {
            setError(err.response ? err.response.data.message : "Check-in gagal");
        }
    };

    const handleCheckOut = async () => {
        setError("");
        setMessage("");
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            };

            const response = await axios.post(
                "http://localhost:3001/api/presensi/check-out", 
                {}, 
                config
            );
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response ? err.response.data.message : "Check-out gagal");
        } 
    };

    // Tentukan tinggi yang diinginkan untuk kamera dan peta (misalnya 400px)
    const mediaHeight = '400px'; 

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
            {/* Ganti max-w-4xl agar lebih besar dan mendukung layout horizontal */}
            <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-4xl text-center"> 
                <h2 className="text-3xl font-bold text-blue-700 mb-6">Lakukan Presensi</h2>

                {message && <p className="text-green-600 bg-green-100 p-3 rounded mb-4">{message}</p>}
                {error && <p className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</p>}
                
                {/* --- FLEX CONTAINER BARU UNTUK KAMERA & PETA (BERSAMPINGAN) --- */}
                <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                    
                    {/* === KIRI: KAMERA DAN TOMBOL (Mengambil 50% lebar di desktop) === */}
                    <div className="w-full md:w-1/2">
                        {/* TAMPILAN KAMERA */}
                        <div className="border rounded-lg overflow-hidden bg-black" style={{ height: mediaHeight }}>
                            {image ? (
                                <img src={image} alt="Selfie" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
                            ) : (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-full h-full object-cover"
                                    style={{ transform: 'scaleX(-1)' }}
                                />
                            )}
                        </div>

                        {/* TOMBOL AMBIL / FOTO ULANG */}
                        <div className="mt-2 mb-4">
                            {!image ? (
                                <button 
                                    onClick={capture} 
                                    className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                                >
                                    Ambil Foto 📸
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setImage(null)} 
                                    className="bg-gray-500 text-white px-4 py-2 rounded w-full hover:bg-gray-600"
                                >
                                    Foto Ulang 🔄
                                </button>
                            )}
                        </div>
                    </div>
                    {/* === END KAMERA === */}

                    {/* === KANAN: PETA (Mengambil 50% lebar di desktop) === */}
                    <div className="w-full md:w-1/2">
                        {coords ? (
                            <div className="border rounded-lg overflow-hidden" style={{ height: mediaHeight }}>
                                <MapContainer
                                    key={`${coords.lat}-${coords.lng}`}
                                    center={[coords.lat, coords.lng]}
                                    zoom={15}
                                    style={{ height: mediaHeight, width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={[coords.lat, coords.lng]}>
                                        <Popup>Lokasi Presensi Anda</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center border rounded-lg bg-gray-200" style={{ height: mediaHeight }}>
                                <p className="text-sm text-gray-500 p-4">
                                    {error ? "Peta tidak dapat ditampilkan karena error lokasi." : "Mencoba mendapatkan lokasi..."}
                                </p>
                            </div>
                        )}
                    </div>
                    {/* === END PETA === */}

                </div>
                {/* --- END FLEX CONTAINER --- */}


                {/* Tombol Check-In/Check-Out diposisikan di bawah container Flex */}
                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={handleCheckIn}
                        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
                        disabled={!coords || !image} 
                    >
                        Check-In
                    </button>
                    <button
                        onClick={handleCheckOut}
                        className="w-full py-3 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700"
                    >
                        Check-Out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AttendancePage;