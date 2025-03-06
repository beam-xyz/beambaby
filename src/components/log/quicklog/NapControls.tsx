
import React, { useState } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Button } from '@/components/ui/button';
import { Play, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddNapForm from '../AddNapForm';

interface NapControlsProps {
  isToday: boolean;
  currentBaby: ReturnType<typeof useBaby>['currentBaby'];
  selectedDate: Date;
}

const NapControls: React.FC<NapControlsProps> = ({ isToday, currentBaby, selectedDate }) => {
  const { activeNap, startNap, endNap } = useBaby();
  const [addNapDialogOpen, setAddNapDialogOpen] = useState(false);
  
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
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant={activeNap ? "destructive" : "outline"}
        size="sm"
        className="h-9 text-xs sm:text-sm"
        onClick={activeNap ? handleEndNap : handleStartNap}
        disabled={!currentBaby || !isToday}
      >
        <Play size={14} className={`mr-1 ${activeNap ? 'hidden' : 'block'}`} />
        {!isToday ? "Nap Tracking" : (activeNap ? "End Nap" : "Start Nap")}
      </Button>

      <Dialog open={addNapDialogOpen} onOpenChange={setAddNapDialogOpen}>
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs sm:text-sm"
          onClick={() => setAddNapDialogOpen(true)}
          disabled={!currentBaby}
        >
          <Plus size={14} className="mr-1" />
          Manual Nap
        </Button>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)]">
          <DialogHeader>
            <DialogTitle>Add Nap</DialogTitle>
          </DialogHeader>
          <AddNapForm 
            selectedDate={selectedDate} 
            onSuccess={() => setAddNapDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NapControls;
