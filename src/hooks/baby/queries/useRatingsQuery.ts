
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DailyRating } from '../types';

export function useRatingsQuery() {
  return useQuery({
    queryKey: ['ratings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_ratings')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data.map((rating: any) => ({
        id: rating.id,
        babyId: rating.baby_id,
        rating: rating.rating,
        date: new Date(rating.date)
      }));
    }
  });
}
