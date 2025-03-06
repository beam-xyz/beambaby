
import React, { useState } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AddFeedFormProps {
  selectedDate: Date;
  onSuccess?: () => void;
}

const AddFeedForm: React.FC<AddFeedFormProps> = ({ selectedDate, onSuccess }) => {
  const { currentBaby, addFeed } = useBaby();
  const [amount, setAmount] = useState<number>(4);
  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm'));
  
  const isToday = new Date(selectedDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentBaby) {
      toast.error("Please select a baby first");
      return;
    }
    
    // Create a date object for the feed time
    const [hours, minutes] = time.split(':').map(Number);
    const feedTime = new Date(selectedDate);
    feedTime.setHours(hours, minutes, 0, 0);
    
    addFeed({
      babyId: currentBaby.id,
      amount,
      time: feedTime,
      date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    });
    
    toast.success(`Added ${amount} oz feed for ${currentBaby.name}`);
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0.5) {
      setAmount(value);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (oz)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          step="0.5"
          min="0.5"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={!currentBaby}>
        Add Feed
      </Button>
    </form>
  );
};

export default AddFeedForm;
