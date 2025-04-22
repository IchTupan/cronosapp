import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Script para detectar dispositivos móveis e backups automáticos
const setUpMobileSupport = () => {
  // Detectar se é um dispositivo Android
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  // Registrar o service worker para PWA se suportado
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(error => {
        console.log('Service Worker registration failed:', error);
      });
    });
  }
  
  // Configurar backup automático para dispositivos Android
  if (isAndroid) {
    // Função para fazer backup dos dados importantes
    const backupData = () => {
      try {
        // Coletar todos os dados importantes
        const dataToBackup = {
          version: '1.0',
          timestamp: new Date().toISOString(),
          desafios: localStorage.getItem('cronos-desafios'),
          sessoes: localStorage.getItem('cronos-sessoes'),
          config: localStorage.getItem('cronos-config'),
          desafioAtual: localStorage.getItem('cronos-desafio-atual')
        };
        
        // Armazenar em um formato único para o dispositivo
        localStorage.setItem('cronos-app-backup', JSON.stringify(dataToBackup));
        
        console.log('Backup automático realizado:', new Date().toLocaleString());
      } catch (error) {
        console.error('Erro ao realizar backup:', error);
      }
    };
    
    // Executar backup a cada 5 minutos e quando o app for para background
    setInterval(backupData, 5 * 60 * 1000);
    
    // Executar backup quando o app for minimizado
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        backupData();
      }
    });
    
    // Executar backup antes de fechar
    window.addEventListener('beforeunload', () => {
      backupData();
    });
    
    // Tentar restaurar o backup se necessário
    try {
      const savedBackup = localStorage.getItem('cronos-app-backup');
      if (savedBackup) {
        const backupData = JSON.parse(savedBackup);
        
        // Verificar se o backup tem dados mais recentes
        if (!localStorage.getItem('cronos-desafios') && backupData.desafios) {
          localStorage.setItem('cronos-desafios', backupData.desafios);
        }
        
        if (!localStorage.getItem('cronos-sessoes') && backupData.sessoes) {
          localStorage.setItem('cronos-sessoes', backupData.sessoes);
        }
        
        console.log('Backup restaurado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
    }
  }
  
  // Adicionar meta viewport para melhor suporte mobile
  const setViewport = () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
    } else {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
  };
  
  setViewport();
};

// Inicializar o suporte para dispositivos móveis
setUpMobileSupport();

createRoot(document.getElementById("root")!).render(<App />);
