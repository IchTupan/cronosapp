import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EstatsCardProps {
  titulo: string;
  valor: number | string;
  descricao: string;
  icone: LucideIcon;
  className?: string;
}

const EstatsCard = ({ titulo, valor, descricao, icone: Icon, className }: EstatsCardProps) => {
  return (
    <div className={cn("glass rounded-lg p-5 flex flex-col border-white/10", className)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-theme-primary font-medium">{titulo}</h3>
        <div className="p-2 bg-white/10 rounded-lg">
          <Icon className="h-5 w-5 text-accent" />
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="text-3xl font-bold text-theme-primary mb-1">{valor}</div>
        <p className="text-sm text-theme-secondary">{descricao}</p>
      </div>
    </div>
  );
};

export default EstatsCard; 