
import React, { useState } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AddNapFormProps {
  selectedDate: Date;
  onSuccess?: () => void;
}

const AddNapForm: React.FC<AddNapFormProps> = ({ selectedDate, onSuccess }) => {
  const { currentBaby, addNap } = useBaby();
  const [startTime, setStartTime] = useState<string>(format(new Date(), 'HH:mm'));
  const [endTime, setEndTime] = useState<string>(format(new Date(), 'HH:mm'));
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentBaby) {
      toast.error("Please select a baby first");
      return;
    }
    
    // Create date objects for the nap start and end times
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const napStartTime = new Date(selectedDate);
    napStartTime.setHours(startHours, startMinutes, 0, 0);
    
    const napEndTime = new Date(selectedDate);
    napEndTime.setHours(endHours, endMinutes, 0, 0);
    
    // Validate that end time is after start time
    if (napEndTime <= napStartTime) {
      toast.error("End time must be after start time");
      return;
    }
    
    addNap({
      babyId: currentBaby.id,
      startTime: napStartTime,
      endTime: napEndTime,
      date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    });
    
    toast.success(`Added nap for ${currentBaby.name}`);
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="startTime" className="text-sm">Start Time</Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="h-9"
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="endTime" className="text-sm">End Time</Label>
        <Input
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="h-9"
        />
      </div>
      
      <Button type="submit" className="w-full h-9 mt-2" disabled={!currentBaby}>
        Add Nap
      </Button>
    </form>
  );
};

export default AddNapForm;
