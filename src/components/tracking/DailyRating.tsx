
import React, { useState, useEffect } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import RatingButtons from './rating/RatingButtons';
import RatingLabel from './rating/RatingLabel';

const DailyRating: React.FC = () => {
  const { currentBaby, addRating, getTodaysRating } = useBaby();
  const [rating, setRating] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    setRating(getTodaysRating());
  }, [getTodaysRating]);
  
  const handleRating = (value: number) => {
    if (!currentBaby) {
      toast.error("Please add a baby first");
      return;
    }
    
    const now = new Date();
    addRating({
      babyId: currentBaby.id,
      rating: value,
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate())
    });
    
    setRating(value);
    toast.success(`Day rated as ${value}/10`);
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-baby-peach to-baby-pink p-4">
        <CardTitle className="flex items-center gap-2">
          <ThumbsUp size={18} />
          <span>Daily Rating</span>
        </CardTitle>
        <CardDescription>How was today?</CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        {rating ? (
          <div className="text-center">
            <RatingLabel rating={rating} />
            
            <div className="text-3xl font-bold mb-4">{rating}/10</div>
            
            <RatingButtons 
              currentRating={rating}
              onRatingSelect={handleRating}
              disabled={!currentBaby}
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No rating yet for today</p>
            
            <RatingButtons 
              onRatingSelect={handleRating}
              disabled={!currentBaby}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyRating;
