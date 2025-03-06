
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Baby } from '../types';

export function useBabiesQuery() {
  return useQuery({
    queryKey: ['babies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('babies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((baby: any) => ({
        ...baby,
        birthDate: new Date(baby.birthDate)
      }));
    }
  });
}
