
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
import { cn } from '@/lib/utils';

interface NapControlsProps {
  isToday: boolean;
  currentBaby: ReturnType<typeof useBaby>['currentBaby'];
  selectedDate: Date;
  showPrimaryButton?: boolean;
  showManualOption?: boolean;
  className?: string;
}

const NapControls: React.FC<NapControlsProps> = ({ 
  isToday, 
  currentBaby, 
  selectedDate,
  showPrimaryButton = true,
  showManualOption = true,
  className
}) => {
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
    <div className={cn("flex flex-col gap-2", className)}>
      {showPrimaryButton && (
        <Button
          variant={activeNap ? "destructive" : "default"}
          size="default"
          onClick={activeNap ? handleEndNap : handleStartNap}
          disabled={!currentBaby || !isToday}
          className="w-full"
        >
          <Play size={16} className={`mr-1 ${activeNap ? 'hidden' : 'block'}`} />
          {!isToday ? "Nap Tracking" : (activeNap ? "End Nap" : "Start Nap")}
        </Button>
      )}

      {showManualOption && (
        <Dialog open={addNapDialogOpen} onOpenChange={setAddNapDialogOpen}>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs text-muted-foreground"
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
      )}
    </div>
  );
};

export default NapControls;
