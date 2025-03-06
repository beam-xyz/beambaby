
import React, { useState } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Utensils, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface QuickFeedControlsProps {
  selectedDate: Date;
  isToday: boolean;
  currentBaby: ReturnType<typeof useBaby>['currentBaby'];
}

const QuickFeedControls: React.FC<QuickFeedControlsProps> = ({ 
  selectedDate, 
  isToday, 
  currentBaby 
}) => {
  const { addFeed } = useBaby();
  const [feedAmount, setFeedAmount] = useState<number>(4);
  
  const handleIncrementFeed = () => {
    setFeedAmount((prev) => prev + 0.5);
  };
  
  const handleDecrementFeed = () => {
    setFeedAmount((prev) => Math.max(0.5, prev - 0.5));
  };
  
  const handleFeedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0.5) {
      setFeedAmount(value);
    }
  };
  
  const handleAddFeed = () => {
    if (!currentBaby) {
      toast.error("Please select a baby first");
      return;
    }
    
    const feedTime = isToday ? new Date() : new Date(selectedDate.setHours(12, 0, 0, 0));
    
    addFeed({
      babyId: currentBaby.id,
      amount: feedAmount,
      time: feedTime,
      date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    });
    
    toast.success(`Added ${feedAmount} oz feed for ${currentBaby.name}`);
  };
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 justify-between bg-card p-2 rounded-lg border">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDecrementFeed}
            className="h-7 w-7 rounded"
          >
            <Minus size={14} />
          </Button>
          <Input
            type="number"
            value={feedAmount}
            onChange={handleFeedAmountChange}
            step="0.5"
            min="0.5"
            className="w-12 h-7 text-center px-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleIncrementFeed}
            className="h-7 w-7 rounded"
          >
            <Plus size={14} />
          </Button>
          <span className="text-xs sm:text-sm">oz</span>
        </div>
        <Button
          variant="default"
          size="default"
          onClick={handleAddFeed}
          disabled={!currentBaby}
        >
          <Utensils size={16} className="mr-1" />
          Quick Feed
        </Button>
      </div>
    </div>
  );
};

export default QuickFeedControls;
