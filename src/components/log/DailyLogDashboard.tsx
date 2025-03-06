
import React, { useState } from 'react';
import { useBaby } from '@/context/BabyContext';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import QuickLogSection from './QuickLogSection';
import ActivityFeed from './ActivityFeed';
import { cn } from '@/lib/utils';

const DailyLogDashboard: React.FC = () => {
  const { currentBaby } = useBaby();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };
  
  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };
  
  const handleToday = () => {
    setSelectedDate(new Date());
  };
  
  const isToday = startOfDay(selectedDate).getTime() === startOfDay(new Date()).getTime();
  
  const babyColor = currentBaby?.color || 'blue';
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center mb-2">
        <h2 className="text-xl font-semibold">Daily Log</h2>
        
        <div className="flex items-center space-x-1 w-full sm:w-auto justify-between sm:justify-normal">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousDay}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous day</span>
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={isToday ? "default" : "outline"} 
                size="sm"
                className={cn(
                  "h-8 min-w-28 justify-start text-left font-normal text-sm",
                  isToday && currentBaby && `bg-baby-${babyColor} hover:bg-baby-${babyColor}/90`
                )}
                style={isToday && currentBaby ? {
                  backgroundColor: `var(--baby-${babyColor})`,
                } : {}}
              >
                <CalendarIcon className="mr-1 h-3 w-3" />
                {format(selectedDate, 'EEE, MMM d')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleToday}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Today
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextDay}
            className="h-8 w-8 p-0"
            disabled={isToday}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next day</span>
          </Button>
        </div>
      </div>
      
      <QuickLogSection selectedDate={selectedDate} />
      
      <ActivityFeed selectedDate={selectedDate} />
    </div>
  );
};

export default DailyLogDashboard;
