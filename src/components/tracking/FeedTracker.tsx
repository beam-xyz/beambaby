
import React, { useState, useEffect } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Utensils, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const FeedTracker: React.FC = () => {
  const { currentBaby, addFeed, getTodaysFeedTotal } = useBaby();
  const [amount, setAmount] = useState<number>(4);
  const [totalFeed, setTotalFeed] = useState<number>(0);
  
  useEffect(() => {
    setTotalFeed(getTodaysFeedTotal());
  }, [getTodaysFeedTotal]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0.5) {
      setAmount(value);
    }
  };
  
  const incrementAmount = () => {
    setAmount((prev) => prev + 0.5);
  };
  
  const decrementAmount = () => {
    setAmount((prev) => Math.max(0.5, prev - 0.5));
  };
  
  const handleAddFeed = () => {
    if (!currentBaby) {
      toast.error("Please add a baby first");
      return;
    }
    
    const now = new Date();
    addFeed({
      babyId: currentBaby.id,
      amount,
      time: now,
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate())
    });
    
    toast.success(`Added ${amount} oz feed for ${currentBaby.name}`);
    setTotalFeed(getTodaysFeedTotal());
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-baby-mint to-baby-blue p-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Utensils size={18} />
              <span>Feed Tracker</span>
            </CardTitle>
            <CardDescription>Record feedings in oz</CardDescription>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Today's Total</div>
            <div className="text-lg font-medium">{totalFeed} oz</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-auto flex items-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrementAmount}
              className="rounded-r-none"
            >
              <Minus size={16} />
            </Button>
            <Input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              step="0.5"
              min="0.5"
              className="w-20 rounded-none text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={incrementAmount}
              className="rounded-l-none"
            >
              <Plus size={16} />
            </Button>
            <span className="ml-2">oz</span>
          </div>
          
          <Button
            variant="default"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            onClick={handleAddFeed}
            disabled={!currentBaby}
          >
            Record Feed
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedTracker;
