
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DailyRating } from '../types';

export function useRatingMutations() {
  const queryClient = useQueryClient();

  const addRatingMutation = useMutation({
    mutationFn: async (rating: Omit<DailyRating, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const dbRating = {
        baby_id: rating.babyId,
        rating: rating.rating,
        date: rating.date,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('daily_ratings')
        .insert([dbRating])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        babyId: data.baby_id,
        rating: data.rating,
        date: new Date(data.date)
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
    }
  });

  return {
    addRating: addRatingMutation.mutateAsync
  };
}
