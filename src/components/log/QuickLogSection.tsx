
import React, { useState } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Utensils, Plus, Minus, CalendarPlus, Moon, GlassWater } from 'lucide-react';
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
import { isSameDay } from 'date-fns';

interface QuickLogSectionProps {
  selectedDate: Date;
}

const QuickLogSection: React.FC<QuickLogSectionProps> = ({ selectedDate }) => {
  const { currentBaby, activeNap, startNap, endNap, addFeed, naps, feeds } = useBaby();
  const [feedAmount, setFeedAmount] = useState<number>(4);
  const [addFeedDialogOpen, setAddFeedDialogOpen] = useState(false);
  
  const isToday = new Date(selectedDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  
  // Calculate daily totals for the selected date
  const dailyFeedTotal = React.useMemo(() => {
    if (!currentBaby) return 0;
    
    return feeds
      .filter(feed => 
        feed.babyId === currentBaby.id && 
        isSameDay(new Date(feed.date), selectedDate)
      )
      .reduce((total, feed) => total + feed.amount, 0);
  }, [currentBaby, feeds, selectedDate]);
  
  const dailyNapTotal = React.useMemo(() => {
    if (!currentBaby) return 0;
    
    return naps
      .filter(nap => {
        return nap.babyId === currentBaby.id && 
               isSameDay(new Date(nap.date), selectedDate) && 
               nap.endTime !== undefined;
      })
      .reduce((total, nap) => {
        if (!nap.endTime) return total;
        const napDuration = (nap.endTime.getTime() - nap.startTime.getTime()) / (1000 * 60); // in minutes
        return total + napDuration;
      }, 0);
  }, [currentBaby, naps, selectedDate]);
  
  const formatNapTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  
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
      <CardContent className="p-3">
        <div className="flex flex-col gap-3">
          {/* Daily Summary Display */}
          {currentBaby && (
            <div className="grid grid-cols-2 gap-2 bg-muted/50 rounded-md p-2 mb-1">
              <div className="flex items-center justify-center gap-1.5 text-sm">
                <GlassWater size={14} className="text-baby-mint" />
                <span className="font-medium">{dailyFeedTotal} oz</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-sm">
                <Moon size={14} className="text-baby-lavender" />
                <span className="font-medium">
                  {dailyNapTotal > 0 ? formatNapTime(dailyNapTotal) : '0m'}
                </span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            {isToday ? (
              <Button
                variant={activeNap ? "destructive" : "outline"}
                size="sm"
                className="h-9 text-xs sm:text-sm w-full"
                onClick={activeNap ? handleEndNap : handleStartNap}
                disabled={!currentBaby}
              >
                <Play size={14} className={`mr-1 ${activeNap ? 'hidden' : 'block'}`} />
                {activeNap ? "End Nap" : "Start Nap"}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs sm:text-sm w-full"
                disabled={true}
              >
                <Play size={14} className="mr-1" />
                Nap Tracking
              </Button>
            )}
            
            <Dialog open={addFeedDialogOpen} onOpenChange={setAddFeedDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs sm:text-sm w-full"
                  disabled={!currentBaby}
                >
                  <CalendarPlus size={14} className="mr-1" />
                  Manual Feed
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
          
          <div className="flex items-center gap-2 justify-between">
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
              size="sm"
              onClick={handleAddFeed}
              disabled={!currentBaby}
              className="h-9 text-xs sm:text-sm"
            >
              <Utensils size={14} className="mr-1" />
              Quick Feed
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickLogSection;
