
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
        id: nap.id,
        babyId: nap.baby_id,
        startTime: new Date(nap.starttime),
        endTime: nap.endtime ? new Date(nap.endtime) : undefined,
        date: new Date(nap.date)
      }));
    }
  });
}
