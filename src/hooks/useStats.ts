
import { useState, useEffect } from "react";

interface StatsData {
  date: string;
  cycles: number;
  minutes: number;
}

/**
 * Hook para computar ciclos e tempo de foco do dia.
 */
function useStats() {
  const [todayCycles, setTodayCycles] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [allTimeMinutes, setAllTimeMinutes] = useState(0);
  const [allTimeCycles, setAllTimeCycles] = useState(0);

  // Lê as métricas ao carregar
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("stats") || "{}") as StatsData;
    const today = new Date().toISOString().split('T')[0];
    
    // Métricas do dia
    if (data?.date === today) {
      setTodayCycles(data.cycles || 0);
      setTodayMinutes(data.minutes || 0);
    } else {
      setTodayCycles(0);
      setTodayMinutes(0);
    }
    
    // Métricas totais
    const totalData = JSON.parse(localStorage.getItem("stats_total") || "{}");
    setAllTimeCycles(totalData.cycles || 0);
    setAllTimeMinutes(totalData.minutes || 0);
  }, []);

  // Atualizar total ao ciclo alterado
  const saveCycle = (minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Atualiza dados diários
    let data = JSON.parse(localStorage.getItem("stats") || "{}") || {};
    if (data?.date !== today) data = { date: today, cycles: 0, minutes: 0 };
    data.cycles += 1;
    data.minutes += minutes;
    localStorage.setItem("stats", JSON.stringify(data));
    setTodayCycles(data.cycles);
    setTodayMinutes(data.minutes);
    
    // Atualiza dados gerais
    let totalData = JSON.parse(localStorage.getItem("stats_total") || "{}") || { cycles: 0, minutes: 0 };
    totalData.cycles += 1;
    totalData.minutes += minutes;
    localStorage.setItem("stats_total", JSON.stringify(totalData));
    setAllTimeCycles(totalData.cycles);
    setAllTimeMinutes(totalData.minutes);
  };

  const resetStats = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem("stats", JSON.stringify({ date: today, cycles: 0, minutes: 0 }));
    setTodayCycles(0);
    setTodayMinutes(0);
  };

  return { 
    todayCycles, 
    todayMinutes, 
    allTimeCycles,
    allTimeMinutes,
    saveCycle, 
    resetStats 
  };
}

export default useStats;
