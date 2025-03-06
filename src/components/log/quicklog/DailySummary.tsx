
import React from 'react';
import { Moon, GlassWater } from 'lucide-react';

interface DailySummaryProps {
  napTotal: number;
  feedTotal: number;
}

const DailySummary: React.FC<DailySummaryProps> = ({ napTotal, feedTotal }) => {
  const formatNapTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  
  return (
    <div className="grid grid-cols-2 gap-2 bg-muted/50 rounded-md p-2 mb-1">
      <div className="flex items-center justify-center gap-1.5 text-sm">
        <Moon size={14} className="text-baby-lavender" />
        <span className="font-medium">
          {napTotal > 0 ? formatNapTime(napTotal) : '0m'}
        </span>
      </div>
      <div className="flex items-center justify-center gap-1.5 text-sm">
        <GlassWater size={14} className="text-baby-mint" />
        <span className="font-medium">{feedTotal} oz</span>
      </div>
    </div>
  );
};

export default DailySummary;
