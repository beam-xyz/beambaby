
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DailyRating } from '../types';

export function useRatingsQuery() {
  return useQuery({
    queryKey: ['ratings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data.map((rating: any) => ({
        ...rating,
        date: new Date(rating.date)
      }));
    }
  });
}
