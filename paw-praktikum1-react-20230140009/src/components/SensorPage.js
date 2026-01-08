import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorPage() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Tambahan state error

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/iot/history');
      
      // Gunakan opsional chaining ?. untuk menghindari crash jika data undefined
      const dataSensor = response.data?.data || [];

      if (dataSensor.length > 0) {
        const labels = dataSensor.map(item => 
          new Date(item.createdAt).toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })
        );
        
        const dataSuhu = dataSensor.map(item => item.suhu);
        const dataLembab = dataSensor.map(item => item.kelembaban);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Suhu (°C)',
              data: dataSuhu,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              tension: 0.3,
            },
            {
              label: 'Kelembaban (%)',
              data: dataLembab,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              tension: 0.3,
            },
          ],
        });
        setError(null);
      }
      setLoading(false);
    } catch (err) {
      console.error("Gagal ambil data sensor:", err);
      setError("Gagal terhubung ke server (CORS atau Server Mati)");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Agar grafik mengikuti besar container
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monitoring Suhu & Kelembaban Real-time' },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard IoT</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '400px' }}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        ) : (
          <Line options={options} data={chartData} />
        )}
      </div>
    </div>
  );
}

export default SensorPage;