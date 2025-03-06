
import React, { useMemo, useState } from 'react';
import { useBaby } from '@/context/BabyContext';
import { isSameDay } from 'date-fns';
import { toast } from 'sonner';
import ActivityCard, { ActivityType } from './ActivityCard';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ActivityEmptyState from './ActivityEmptyState';

interface ActivityFeedProps {
  selectedDate: Date;
}

type Activity = {
  id: string;
  type: ActivityType;
  time: Date;
  details: any;
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ selectedDate }) => {
  const { currentBaby, naps, feeds, ratings, deleteNap, deleteFeed } = useBaby();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'nap' | 'feed' } | null>(null);
  
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

  const handleDeleteClick = (id: string, type: 'nap' | 'feed') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'nap') {
      deleteNap(itemToDelete.id);
      toast.success('Nap deleted successfully');
    } else if (itemToDelete.type === 'feed') {
      deleteFeed(itemToDelete.id);
      toast.success('Feed deleted successfully');
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };
  
  if (!currentBaby) {
    return <ActivityEmptyState message="Please select a baby to view activities" />;
  }
  
  if (activities.length === 0) {
    return <ActivityEmptyState message="No activities logged for this day" />;
  }
  
  return (
    <div className="space-y-2 pb-4">
      <h3 className="text-sm font-medium text-muted-foreground px-1 flex justify-between items-center">
        <span>Today's Activities</span>
        <span className="text-xs text-muted-foreground">({activities.length})</span>
      </h3>
      
      <div className="max-h-[calc(100vh-280px)] overflow-y-auto scroll-hidden space-y-2 pb-16 sm:pb-0">
        {activities.map((activity) => (
          <ActivityCard 
            key={activity.id}
            id={activity.id}
            type={activity.type}
            time={activity.time}
            details={activity.details}
            onDelete={activity.type === 'nap' || activity.type === 'feed' ? handleDeleteClick : undefined}
          />
        ))}
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        itemType={itemToDelete?.type || null}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ActivityFeed;
