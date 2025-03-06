
import { Nap, Feed, DailyRating } from './types';
import { generateId, getTodayDate, isSameDay } from '@/utils/babyUtils';

export const calculateTodaysNapTotal = (naps: Nap[], babyId?: string): number => {
  if (!babyId) return 0;
  
  const today = getTodayDate();
  
  return naps
    .filter(nap => {
      return nap.babyId === babyId && 
            isSameDay(nap.date, today) && 
            nap.endTime !== undefined;
    })
    .reduce((total, nap) => {
      if (!nap.endTime) return total;
      const napDuration = (nap.endTime.getTime() - nap.startTime.getTime()) / (1000 * 60); // in minutes
      return total + napDuration;
    }, 0);
};

export const calculateTodaysFeedTotal = (feeds: Feed[], babyId?: string): number => {
  if (!babyId) return 0;
  
  const today = getTodayDate();
  return feeds
    .filter(feed => feed.babyId === babyId && isSameDay(feed.date, today))
    .reduce((total, feed) => total + feed.amount, 0);
};

export const getTodaysRating = (ratings: DailyRating[], babyId?: string): number | undefined => {
  if (!babyId) return undefined;
  
  const today = getTodayDate();
  const todayRating = ratings.find(
    rating => rating.babyId === babyId && isSameDay(rating.date, today)
  );
  
  return todayRating?.rating;
};
