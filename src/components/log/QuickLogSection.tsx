
import React, { useState } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Card, CardContent } from '@/components/ui/card';
import { isSameDay } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddFeedForm from './AddFeedForm';
import DailySummary from './quicklog/DailySummary';
import NapControls from './quicklog/NapControls';
import ManualFeedButton from './quicklog/ManualFeedButton';
import QuickFeedControls from './quicklog/QuickFeedControls';

interface QuickLogSectionProps {
  selectedDate: Date;
}

const QuickLogSection: React.FC<QuickLogSectionProps> = ({ selectedDate }) => {
  const { currentBaby, naps, feeds } = useBaby();
  const [addFeedDialogOpen, setAddFeedDialogOpen] = useState(false);
  
  const isToday = new Date(selectedDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  
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
  
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-3">
        <div className="flex flex-col gap-4">
          {currentBaby && (
            <DailySummary napTotal={dailyNapTotal} feedTotal={dailyFeedTotal} />
          )}
          
          <div className="space-y-4">
            <NapControls 
              isToday={isToday} 
              currentBaby={currentBaby}
              selectedDate={selectedDate}
            />
            
            <div className="space-y-2">
              <QuickFeedControls 
                selectedDate={selectedDate}
                isToday={isToday}
                currentBaby={currentBaby}
              />
              
              <Dialog open={addFeedDialogOpen} onOpenChange={setAddFeedDialogOpen}>
                <ManualFeedButton 
                  disabled={!currentBaby} 
                  className="w-full text-xs text-muted-foreground" 
                />
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
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickLogSection;
