import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from 'next-themes';

// Registrar os componentes necessários do ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface DadosCategoria {
  categoria: string;
  quantidade: number;
}

interface GraficoCategoriaProps {
  dadosCategorias: DadosCategoria[];
}

const GraficoCategoria = ({ dadosCategorias }: GraficoCategoriaProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 60, 60, 0.9)',
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(20, 20, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#fff' : '#333',
        bodyColor: isDarkMode ? '#fff' : '#333',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    },
    cutout: '70%',
  };

  // Mapeamento de cores por categoria
  const corCategoria = {
    trabalho: {
      cor: 'rgba(255, 165, 0, 0.8)',  // Laranja
      borda: 'rgba(255, 165, 0, 1)'
    },
    estudos: {
      cor: 'rgba(30, 144, 255, 0.8)', // Azul
      borda: 'rgba(30, 144, 255, 1)'
    },
    pessoal: {
      cor: 'rgba(50, 205, 50, 0.8)',  // Verde
      borda: 'rgba(50, 205, 50, 1)'
    },
    saúde: {
      cor: 'rgba(255, 105, 180, 0.8)', // Rosa
      borda: 'rgba(255, 105, 180, 1)'
    },
    outro: {
      cor: 'rgba(138, 43, 226, 0.8)', // Roxo
      borda: 'rgba(138, 43, 226, 1)'
    }
  };

  const data = {
    labels: dadosCategorias.map(item => {
      // Capitalizar a primeira letra
      return item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1);
    }),
    datasets: [
      {
        data: dadosCategorias.map(item => item.quantidade),
        backgroundColor: dadosCategorias.map(item => 
          corCategoria[item.categoria as keyof typeof corCategoria]?.cor || 'rgba(180, 180, 180, 0.8)'
        ),
        borderColor: dadosCategorias.map(item => 
          corCategoria[item.categoria as keyof typeof corCategoria]?.borda || 'rgba(180, 180, 180, 1)'
        ),
        borderWidth: 1,
        hoverOffset: 10
      },
    ],
  };

  return (
    <div className="glass rounded-lg p-6">
      <h3 className="text-lg font-medium text-theme-primary mb-4">Desafios por Categoria</h3>
      <div className="h-64">
        {dadosCategorias && dadosCategorias.length > 0 ? (
          <Doughnut options={options} data={data} />
        ) : (
          <div className="flex items-center justify-center h-full bg-white/5 rounded-lg">
            <p className="text-theme-secondary text-sm">
              Crie desafios para ver estatísticas por categoria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraficoCategoria; 