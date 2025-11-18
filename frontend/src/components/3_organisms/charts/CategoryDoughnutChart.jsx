import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryDoughnutChart = ({ categoryData }) => {

  const data = {
    labels: categoryData.map(d => d.category), // BlindBox, Peluche, etc.
    datasets: [
      {
        label: 'Ventas',
        data: categoryData.map(d => d.total_sold),
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)', // Verde (BlindBox)
          'rgba(54, 162, 235, 0.7)', // Azul (Peluche)
          'rgba(153, 102, 255, 0.7)', // Morado (Llavero)
          'rgba(255, 159, 64, 0.7)', // Naranja
          'rgba(255, 99, 132, 0.7)', // Rojo
        ],
        borderColor: [
          'rgba(255, 255, 255, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', // Pone las etiquetas abajo
      },
      title: { display: false },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default CategoryDoughnutChart;