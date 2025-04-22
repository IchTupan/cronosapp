import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeTitle?: string;
}

const CelebrationModal = ({ 
  isOpen, 
  onClose,
  challengeTitle = "seu desafio"
}: CelebrationModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && !showConfetti) {
      setShowConfetti(true);
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isOpen, showConfetti]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative glass-morphism max-w-md w-full overflow-hidden rounded-2xl p-0"
          >
            <div className="bg-gradient-to-r from-violet-600/50 to-purple-600/50 px-6 py-8 text-center">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200
                }}
                className="flex justify-center mb-4"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <svg className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 15H4C3.44772 15 3 14.5523 3 14V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V14C21 14.5523 20.5523 15 20 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8L15 11L12 14M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 21H16M12 15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">Parabéns!</h2>
                <div className="flex items-center justify-center">
                  <svg className="h-4 w-4 text-yellow-300 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L13.5 8H19L14.5 11.5L16 16.5L12 13.5L8 16.5L9.5 11.5L5 8H10.5L12 3Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-yellow-300 font-semibold">Objetivo alcançado</p>
                  <svg className="h-4 w-4 text-yellow-300 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L13.5 8H19L14.5 11.5L16 16.5L12 13.5L8 16.5L9.5 11.5L5 8H10.5L12 3Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-white/90 mt-4">
                  Você completou <span className="font-semibold text-white">{challengeTitle}</span> com sucesso!
                </p>
              </motion.div>
            </div>
            
            <div className="p-6 bg-gradient-to-b from-transparent to-purple-900/20">
              <div className="space-y-4">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="flex items-center p-3 glass rounded-lg"
                >
                  <div className="p-2 bg-teal-500/20 rounded-full mr-3">
                    <svg className="h-5 w-5 text-teal-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12L18 8V11H6V8L2 12L6 16V13H18V16L22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/90 text-sm">Continue desenvolvendo o hábito!</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="flex items-center p-3 glass rounded-lg"
                >
                  <div className="p-2 bg-pink-500/20 rounded-full mr-3">
                    <svg className="h-5 w-5 text-pink-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3V6M5.63604 5.63604L7.75736 7.75736M3 12H6M5.63604 18.364L7.75736 16.2426M12 21V18M18.364 18.364L16.2426 16.2426M21 12H18M18.364 5.63604L16.2426 7.75736" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/90 text-sm">Que tal criar um novo desafio?</p>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-6 flex justify-center"
              >
                <Button 
                  onClick={onClose}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium px-8 py-5 rounded-lg border-none hover:opacity-90 transition-opacity"
                >
                  Continuar
                </Button>
              </motion.div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationModal; 