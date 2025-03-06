
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Feed } from '../types';

export function useFeedMutations() {
  const queryClient = useQueryClient();

  const addFeedMutation = useMutation({
    mutationFn: async (feed: Omit<Feed, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const dbFeed = {
        baby_id: feed.babyId,
        amount: feed.amount,
        time: feed.time,
        date: feed.date,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('feeds')
        .insert([dbFeed])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        babyId: data.baby_id,
        amount: data.amount,
        time: new Date(data.time),
        date: new Date(data.date)
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    }
  });

  const deleteFeedMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('feeds')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    }
  });

  return {
    addFeed: addFeedMutation.mutateAsync,
    deleteFeed: deleteFeedMutation.mutateAsync
  };
}
