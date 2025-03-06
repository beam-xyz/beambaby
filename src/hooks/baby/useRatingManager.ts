
import { DailyRating } from './types';
import { generateId, getTodayDate, isSameDay } from '@/utils/babyUtils';

export function useRatingManager(
  ratings: DailyRating[],
  setRatings: React.Dispatch<React.SetStateAction<DailyRating[]>>
) {
  const addRating = (ratingData: Omit<DailyRating, 'id'>) => {
    const today = getTodayDate();
    
    // Check if a rating already exists for today
    const existingTodayRating = ratings.find(
      r => r.babyId === ratingData.babyId && isSameDay(r.date, today)
    );

    if (existingTodayRating) {
      // Update existing rating
      setRatings(prev => 
        prev.map(r => 
          r.id === existingTodayRating.id ? { ...r, rating: ratingData.rating } : r
        )
      );
    } else {
      // Add new rating
      const newRating = { ...ratingData, id: generateId() };
      setRatings(prev => [...prev, newRating]);
    }
  };

  return {
    addRating
  };
}
