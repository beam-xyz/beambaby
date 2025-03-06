
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Feed } from '../types';

export function useFeedsQuery() {
  return useQuery({
    queryKey: ['feeds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data.map((feed: any) => ({
        id: feed.id,
        babyId: feed.baby_id,
        amount: feed.amount,
        time: new Date(feed.time),
        date: new Date(feed.date)
      }));
    }
  });
}
