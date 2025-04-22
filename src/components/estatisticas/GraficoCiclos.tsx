import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from 'next-themes';

// Registrar os componentes necessários do ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GraficoCiclosProps {
  dadosSemanais: number[];
}

const GraficoCiclos = ({ dadosSemanais }: GraficoCiclosProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(20, 20, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#fff' : '#333',
        bodyColor: isDarkMode ? '#fff' : '#333',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(30, 60, 60, 0.7)',
        },
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(30, 60, 60, 0.7)',
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: diasSemana,
    datasets: [
      {
        data: dadosSemanais,
        backgroundColor: [
          'rgba(138, 43, 226, 0.7)', // Domingo - Roxo
          'rgba(30, 144, 255, 0.7)', // Segunda - Azul
          'rgba(0, 206, 209, 0.7)',  // Terça - Turquesa
          'rgba(255, 105, 180, 0.7)', // Quarta - Rosa
          'rgba(50, 205, 50, 0.7)',  // Quinta - Verde
          'rgba(255, 165, 0, 0.7)',  // Sexta - Laranja
          'rgba(255, 69, 0, 0.7)',   // Sábado - Vermelho
        ],
        borderColor: 'transparent',
        borderRadius: 8,
        borderWidth: 0,
        barThickness: 16,
      },
    ],
  };

  return (
    <div className="glass rounded-lg p-6">
      <h3 className="text-lg font-medium text-theme-primary mb-4">Ciclos por Dia da Semana</h3>
      <div className="h-64">
        {dadosSemanais && dadosSemanais.length > 0 ? (
          <Bar options={options} data={data} />
        ) : (
          <div className="flex items-center justify-center h-full bg-white/5 rounded-lg">
            <p className="text-theme-secondary text-sm">
              Complete alguns ciclos para ver estatísticas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraficoCiclos; 