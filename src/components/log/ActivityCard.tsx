
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Utensils, Moon, Star, Trash2 } from 'lucide-react';

export type ActivityType = 'nap' | 'feed' | 'rating';

export interface ActivityCardProps {
  id: string;
  type: ActivityType;
  time: Date;
  details: any;
  onDelete?: (id: string, type: 'nap' | 'feed') => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ id, type, time, details, onDelete }) => {
  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <div className="flex">
        <div className={`w-1.5 ${
          type === 'nap' 
            ? 'bg-baby-lavender' 
            : type === 'feed' 
              ? 'bg-baby-mint' 
              : 'bg-baby-peach'
        }`} />
        <CardContent className="p-3 w-full">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5">
              {type === 'nap' && <Moon size={14} className="text-baby-lavender" />}
              {type === 'feed' && <Utensils size={14} className="text-baby-mint" />}
              {type === 'rating' && <Star size={14} className="text-baby-peach" />}
              
              <div>
                <div className="font-medium text-sm">
                  {type === 'nap' && 'Nap'}
                  {type === 'feed' && 'Feed'}
                  {type === 'rating' && 'Daily Rating'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(time, 'h:mm a')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                {type === 'nap' && (
                  <div>
                    {details.duration ? (
                      <span className="font-semibold text-sm">
                        {Math.floor(details.duration / 60) > 0 ? 
                          `${Math.floor(details.duration / 60)}h ` : ''}
                        {details.duration % 60}m
                      </span>
                    ) : (
                      <span className="text-xs text-primary font-medium">In Progress</span>
                    )}
                  </div>
                )}
                
                {type === 'feed' && (
                  <div className="font-semibold text-sm">
                    {details.amount} oz
                  </div>
                )}
                
                {type === 'rating' && (
                  <div className="font-semibold text-sm flex items-center gap-0.5">
                    {details.rating}/10
                    <Star size={12} className="fill-baby-peach text-baby-peach" />
                  </div>
                )}
              </div>
              
              {/* Only show delete button for nap or feed, not for ratings */}
              {(type === 'nap' || type === 'feed') && onDelete && (
                <button 
                  onClick={() => onDelete(id, type)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  aria-label={`Delete ${type}`}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ActivityCard;
