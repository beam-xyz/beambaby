
import React, { useState, useEffect } from 'react';
import { useBaby } from '@/context/BabyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

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
  
  const getRatingLabel = (value: number) => {
    if (value <= 3) return "Tough day";
    if (value <= 6) return "Average day";
    if (value <= 8) return "Good day";
    return "Great day!";
  };
  
  const getRatingColor = (value: number) => {
    if (value <= 3) return "bg-red-100 text-red-700";
    if (value <= 6) return "bg-orange-100 text-orange-700";
    if (value <= 8) return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
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
            <div className="mb-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRatingColor(rating)}`}>
                {getRatingLabel(rating)}
              </span>
            </div>
            
            <div className="text-3xl font-bold mb-4">{rating}/10</div>
            
            <div className="flex flex-wrap justify-center gap-1">
              {[...Array(10)].map((_, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${
                    index + 1 === rating
                      ? "bg-primary text-white scale-110"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                  onClick={() => handleRating(index + 1)}
                  disabled={!currentBaby}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No rating yet for today</p>
            
            <div className="flex flex-wrap justify-center gap-1">
              {[...Array(10)].map((_, index) => (
                <button
                  key={index}
                  className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 transition-all duration-200"
                  onClick={() => handleRating(index + 1)}
                  disabled={!currentBaby}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyRating;
