
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DailyRating } from '../types';

export function useRatingMutations() {
  const queryClient = useQueryClient();

  const addRatingMutation = useMutation({
    mutationFn: async (rating: Omit<DailyRating, 'id'>) => {
      const { data, error } = await supabase
        .from('ratings')
        .insert([rating])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
    }
  });

  return {
    addRating: addRatingMutation.mutateAsync
  };
}
