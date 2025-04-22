import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Timer from "./pages/Timer";
import Desafios from "./pages/Desafios";
import Estatisticas from "./pages/Estatisticas";
import { useRef } from "react";
import { TimerProvider } from "@/contexts/TimerContext";
import { AppLayout } from "@/components/AppLayout";

const queryClient = new QueryClient();

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TimerProvider>
        <BrowserRouter>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <AppLayout audioRef={audioRef}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/timer" element={<Timer />} />
                <Route path="/desafios" element={<Desafios />} />
                <Route path="/estatisticas" element={<Estatisticas />} />
                <Route path="/configuracoes" element={<div>Configurações em breve</div>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
            <Toaster />
            <Sonner />
          </ThemeProvider>
        </BrowserRouter>
      </TimerProvider>
    </QueryClientProvider>
  );
}

export default App;
