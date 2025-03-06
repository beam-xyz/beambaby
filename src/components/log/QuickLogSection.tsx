
import React, { useState } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Utensils, Plus, Minus, CalendarPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddFeedForm from './AddFeedForm';

interface QuickLogSectionProps {
  selectedDate: Date;
}

const QuickLogSection: React.FC<QuickLogSectionProps> = ({ selectedDate }) => {
  const { currentBaby, activeNap, startNap, endNap, addFeed } = useBaby();
  const [feedAmount, setFeedAmount] = useState<number>(4);
  const [addFeedDialogOpen, setAddFeedDialogOpen] = useState(false);
  
  const isToday = new Date(selectedDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  
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
    
    // For today, use current time. For past days, use noon
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
    <Card className="border border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <h3 className="font-medium text-sm text-muted-foreground sm:w-28">Quick Log:</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {isToday ? (
              <div>
                {activeNap ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={handleEndNap}
                  >
                    End Current Nap
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={handleStartNap}
                    disabled={!currentBaby}
                  >
                    <Play size={14} className="mr-1" />
                    Start Nap
                  </Button>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                disabled={true}
              >
                <Play size={14} className="mr-1" />
                Nap Tracking
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-md overflow-hidden">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleDecrementFeed}
                  className="h-8 w-8 rounded-none"
                >
                  <Minus size={14} />
                </Button>
                <Input
                  type="number"
                  value={feedAmount}
                  onChange={handleFeedAmountChange}
                  step="0.5"
                  min="0.5"
                  className="w-14 h-8 rounded-none text-center border-0"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleIncrementFeed}
                  className="h-8 w-8 rounded-none"
                >
                  <Plus size={14} />
                </Button>
              </div>
              <span className="text-sm">oz</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddFeed}
                disabled={!currentBaby}
                className="ml-2"
              >
                <Utensils size={14} className="mr-1" />
                Add Feed
              </Button>
            </div>
            
            <Dialog open={addFeedDialogOpen} onOpenChange={setAddFeedDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={!currentBaby}
                >
                  <CalendarPlus size={14} className="mr-1" />
                  Manual Feed Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)]">
                <DialogHeader>
                  <DialogTitle>Add Feed</DialogTitle>
                </DialogHeader>
                <AddFeedForm 
                  selectedDate={selectedDate} 
                  onSuccess={() => setAddFeedDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickLogSection;
