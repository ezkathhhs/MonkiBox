import React from 'react';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
);

const SalesLineChart = ({ salesData }) => {
  
  // Convertir los datos de la API al formato de Chart.js
  const data = {
    labels: salesData.map(d => new Date(d.day).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })),
    datasets: [
      {
        label: 'Ventas por Día',
        data: salesData.map(d => d.total_sales),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
  };

  return <Line options={options} data={data} />;
};

export default SalesLineChart;