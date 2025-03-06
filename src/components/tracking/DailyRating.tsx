
import React, { useState } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Button } from '@/components/ui/button';
import RatingButtons from './rating/RatingButtons';
import RatingLabel from './rating/RatingLabel';
import { toast } from 'sonner';

const DailyRating: React.FC = () => {
  const { currentBaby, addRating, getTodaysRating } = useBaby();
  const [rating, setRating] = useState<number | undefined>(getTodaysRating());
  
  const handleRatingSelect = (value: number) => {
    setRating(value);
  };
  
  const handleSubmit = () => {
    if (!currentBaby || !rating) return;
    
    addRating({
      babyId: currentBaby.id,
      rating,
      date: new Date(),
    });
    
    toast.success(`Day rated as ${rating}/10`);
  };
  
  return (
    <div className="flex flex-col items-center">
      {rating && <RatingLabel rating={rating} />}
      
      <RatingButtons 
        currentRating={rating} 
        onRatingSelect={handleRatingSelect} 
        disabled={!currentBaby}
      />
      
      <Button
        onClick={handleSubmit}
        disabled={!currentBaby || !rating}
        className="mt-6 px-8"
      >
        Save Rating
      </Button>
    </div>
  );
};

export default DailyRating;
