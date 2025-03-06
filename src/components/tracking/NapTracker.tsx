
import React, { useState, useEffect } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Play, Square, Clock, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { toast } from 'sonner';

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

const NapTracker: React.FC = () => {
  const { currentBaby, activeNap, startNap, endNap, getTodaysNapTotal } = useBaby();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [totalNapTime, setTotalNapTime] = useState<number>(0);
  
  useEffect(() => {
    setTotalNapTime(getTodaysNapTotal());
  }, [getTodaysNapTotal]);
  
  useEffect(() => {
    if (!activeNap) {
      setElapsedTime(0);
      return;
    }
    
    const calculateElapsed = () => {
      const now = new Date();
      const start = new Date(activeNap.startTime);
      setElapsedTime((now.getTime() - start.getTime()) / (1000 * 60)); // in minutes
    };
    
    calculateElapsed(); // Initial calculation
    
    const intervalId = setInterval(calculateElapsed, 1000);
    
    return () => clearInterval(intervalId);
  }, [activeNap]);
  
  const handleStartNap = () => {
    if (!currentBaby) {
      toast.error("Please add a baby first");
      return;
    }
    
    startNap();
    toast.success(`Started nap tracking for ${currentBaby.name}`);
  };
  
  const handleEndNap = () => {
    if (!activeNap) return;
    
    endNap();
    toast.success("Nap tracked successfully");
    setTotalNapTime(getTodaysNapTotal());
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-baby-lavender to-baby-blue p-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Moon size={18} />
              <span>Nap Tracker</span>
            </CardTitle>
            <CardDescription>Track your baby's sleep</CardDescription>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Today's Total</div>
            <div className="text-lg font-medium">{formatDuration(totalNapTime)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {activeNap ? (
          <div className="flex flex-col items-center">
            <div className="text-center mb-4">
              <div className="text-muted-foreground text-sm">
                Started at {format(activeNap.startTime, 'h:mm a')}
              </div>
              <div className="text-3xl font-bold my-3 flex items-center justify-center">
                <Clock className="mr-2 text-primary animate-wave" />
                {formatDuration(elapsedTime)}
              </div>
              <div className="text-primary text-sm">Nap in progress</div>
            </div>
            
            <Button
              variant="destructive"
              size="lg"
              className="w-full sm:w-auto flex items-center gap-2"
              onClick={handleEndNap}
            >
              <Square size={16} />
              <span>End Nap</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2"
            onClick={handleStartNap}
            disabled={!currentBaby}
          >
            <Play size={16} />
            <span>Start Nap</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NapTracker;
