
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Nap } from '../types';

export function useNapsQuery() {
  return useQuery({
    queryKey: ['naps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('naps')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data.map((nap: any) => ({
        ...nap,
        startTime: new Date(nap.startTime),
        endTime: nap.endTime ? new Date(nap.endTime) : undefined,
        date: new Date(nap.date)
      }));
    }
  });
}
