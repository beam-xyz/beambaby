
import React from 'react';
import { useBaby } from '@/context/BabyContext';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { toast } from 'sonner';

interface NapControlsProps {
  isToday: boolean;
  currentBaby: ReturnType<typeof useBaby>['currentBaby'];
}

const NapControls: React.FC<NapControlsProps> = ({ isToday, currentBaby }) => {
  const { activeNap, startNap, endNap } = useBaby();
  
  const handleStartNap = () => {
    if (!currentBaby) {
      toast.error("Please select a baby first");
      return;
    }
    
    startNap();
    toast.success(`Started nap tracking for ${currentBaby.name}`);
  };
  
  const handleEndNap = () => {
    if (!activeNap) return;
    
    endNap();
    toast.success("Nap tracked successfully");
  };
  
  return (
    <Button
      variant={activeNap ? "destructive" : "outline"}
      size="sm"
      className="h-9 text-xs sm:text-sm w-full"
      onClick={activeNap ? handleEndNap : handleStartNap}
      disabled={!currentBaby || !isToday}
    >
      <Play size={14} className={`mr-1 ${activeNap ? 'hidden' : 'block'}`} />
      {!isToday ? "Nap Tracking" : (activeNap ? "End Nap" : "Start Nap")}
    </Button>
  );
};

export default NapControls;
