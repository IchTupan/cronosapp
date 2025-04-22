
import { useState } from "react";

const quotes = [
  "A jornada de mil passos começa com o primeiro.",
  "Cada ciclo é uma vitória rumo aos seus objetivos.",
  "Foque no progresso, não na perfeição.",
  "Você é capaz de grandes conquistas!",
  "Um minuto de esforço vale para a vida toda.",
  "O foco é a chave do sucesso.",
  "A disciplina é a ponte entre metas e conquistas.",
  "Pequenos passos diários levam a grandes resultados.",
  "O tempo é seu ativo mais valioso, invista-o com sabedoria.",
  "Sua atenção determina sua realidade."
];

export default function useQuotes() {
  const [quote, setQuote] = useState<string>(() => 
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  const getRandomQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(newQuote);
    return newQuote;
  };

  return {
    quote,
    getRandomQuote
  };
}
