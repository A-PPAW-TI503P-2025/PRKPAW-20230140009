import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// Pastikan Anda juga menginstal 'react-leaflet' dan 'leaflet' (npm install react-leaflet leaflet)

// Fungsi pembantu untuk mengambil token dari LocalStorage
const getToken = () => localStorage.getItem("token");

function AttendancePage() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [coords, setCoords] = useState(null); // State untuk menyimpan koordinat {lat, lng}

    // --- 1. LOGIKA GEOLOCATION API ---
    const getLocation = () => {
        if (navigator.geolocation) {
            // Meminta izin lokasi dan mendapatkan posisi saat ini
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude, // Ambil latitude
                        lng: position.coords.longitude // Ambil longitude
                    });
                    setError(null);
                },
                (error) => {
                    // Tangani jika pengguna menolak atau terjadi error
                    setError("Gagal mendapatkan lokasi: " + error.message + ". Check-In memerlukan lokasi.");
                    setCoords(null);
                }
            );
        } else {
            setError("Geolocation tidak didukung oleh browser ini.");
        }
    };

    // Panggil getLocation saat komponen dimuat
    useEffect(() => {
        getLocation();
    }, []);
    // ------------------------------------

    // --- 2. LOGIKA CHECK-IN (Mengirim Lokasi) ---
    const handleCheckIn = async () => {
        setError(""); 
        setMessage(""); 
        
        // Validasi lokasi sebelum mengirim request
        if (!coords) { 
            setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            };

            // Mengirim koordinat di body request sesuai perbaikan di backend
            const response = await axios.post(
                "http://localhost:3001/api/presensi/check-in", 
                {
                    latitude: coords.lat,  // Data dikirim ke backend
                    longitude: coords.lng // Data dikirim ke backend
                }, 
                config
            );

            setMessage(response.data.message);
        } catch (err) {
            setError(err.response ? err.response.data.message : "Check-in gagal");
        }
    };
    // ------------------------------------

    // --- 3. LOGIKA CHECK-OUT ---
    const handleCheckOut = async () => {
        setError("");
        setMessage("");
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            };

            // Check-out tidak mengirim lokasi (asumsi modul)
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
    // ------------------------------------


        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
                <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md text-center">
                    <h2 className="text-3xl font-bold text-blue-700 mb-6">Lakukan Presensi</h2>

                    {message && <p className="text-green-600 bg-green-100 p-3 rounded mb-4">{message}</p>}
                    {error && <p className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</p>}

                    {coords ? (
                        <div className="my-4 border rounded-lg overflow-hidden">
                            <MapContainer
                                key={`${coords.lat}-${coords.lng}`}
                                center={[coords.lat, coords.lng]}
                                zoom={15}
                                style={{ height: '300px', width: '100%' }}
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
                        <p className="text-sm text-gray-500 mb-4">
                            {error ? "Peta tidak dapat ditampilkan karena error lokasi." : "Mencoba mendapatkan lokasi..."}
                        </p>
                    )}

                    <div className="flex space-x-4 mt-6">
                        <button
                            onClick={handleCheckIn}
                            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
                            disabled={!coords}
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