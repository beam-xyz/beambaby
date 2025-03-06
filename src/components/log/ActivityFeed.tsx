
import React, { useMemo } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay } from 'date-fns';
import { Utensils, Moon, Star } from 'lucide-react';

interface ActivityFeedProps {
  selectedDate: Date;
}

type Activity = {
  id: string;
  type: 'nap' | 'feed' | 'rating';
  time: Date;
  details: any;
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ selectedDate }) => {
  const { currentBaby, naps, feeds, ratings } = useBaby();
  
  const activities = useMemo(() => {
    if (!currentBaby) return [];
    
    const allActivities: Activity[] = [];
    
    // Add naps
    naps
      .filter(nap => nap.babyId === currentBaby.id && isSameDay(new Date(nap.date), selectedDate))
      .forEach(nap => {
        allActivities.push({
          id: nap.id,
          type: 'nap',
          time: new Date(nap.startTime),
          details: {
            startTime: nap.startTime,
            endTime: nap.endTime,
            duration: nap.endTime ? 
              Math.round((new Date(nap.endTime).getTime() - new Date(nap.startTime).getTime()) / (1000 * 60)) : 
              null
          }
        });
      });
    
    // Add feeds
    feeds
      .filter(feed => feed.babyId === currentBaby.id && isSameDay(new Date(feed.date), selectedDate))
      .forEach(feed => {
        allActivities.push({
          id: feed.id,
          type: 'feed',
          time: new Date(feed.time),
          details: {
            amount: feed.amount
          }
        });
      });
    
    // Add ratings
    ratings
      .filter(rating => rating.babyId === currentBaby.id && isSameDay(new Date(rating.date), selectedDate))
      .forEach(rating => {
        allActivities.push({
          id: rating.id,
          type: 'rating',
          time: new Date(rating.date),
          details: {
            rating: rating.rating
          }
        });
      });
    
    // Sort by time (newest first)
    return allActivities.sort((a, b) => b.time.getTime() - a.time.getTime());
  }, [currentBaby, naps, feeds, ratings, selectedDate]);
  
  if (!currentBaby) {
    return (
      <Card className="border border-border shadow-sm">
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground text-sm">Please select a baby to view activities</p>
        </CardContent>
      </Card>
    );
  }
  
  if (activities.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground text-sm">No activities logged for this day</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-2 pb-4">
      <h3 className="text-sm font-medium text-muted-foreground px-1">Today's Activities</h3>
      
      <div className="max-h-[calc(100vh-280px)] overflow-y-auto scroll-hidden space-y-2">
        {activities.map((activity) => (
          <Card key={activity.id} className="border border-border shadow-sm overflow-hidden">
            <div className="flex">
              <div className={`w-1.5 ${
                activity.type === 'nap' 
                  ? 'bg-baby-lavender' 
                  : activity.type === 'feed' 
                    ? 'bg-baby-mint' 
                    : 'bg-baby-peach'
              }`} />
              <CardContent className="p-3 w-full">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    {activity.type === 'nap' && <Moon size={14} className="text-baby-lavender" />}
                    {activity.type === 'feed' && <Utensils size={14} className="text-baby-mint" />}
                    {activity.type === 'rating' && <Star size={14} className="text-baby-peach" />}
                    
                    <div>
                      <div className="font-medium text-sm">
                        {activity.type === 'nap' && 'Nap'}
                        {activity.type === 'feed' && 'Feed'}
                        {activity.type === 'rating' && 'Daily Rating'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(activity.time, 'h:mm a')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {activity.type === 'nap' && (
                      <div>
                        {activity.details.duration ? (
                          <span className="font-semibold text-sm">
                            {Math.floor(activity.details.duration / 60) > 0 ? 
                              `${Math.floor(activity.details.duration / 60)}h ` : ''}
                            {activity.details.duration % 60}m
                          </span>
                        ) : (
                          <span className="text-xs text-primary font-medium">In Progress</span>
                        )}
                      </div>
                    )}
                    
                    {activity.type === 'feed' && (
                      <div className="font-semibold text-sm">
                        {activity.details.amount} oz
                      </div>
                    )}
                    
                    {activity.type === 'rating' && (
                      <div className="font-semibold text-sm flex items-center gap-0.5">
                        {activity.details.rating}/10
                        <Star size={12} className="fill-baby-peach text-baby-peach" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
