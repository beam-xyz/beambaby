
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Feed } from '../types';

export function useFeedMutations() {
  const queryClient = useQueryClient();

  const addFeedMutation = useMutation({
    mutationFn: async (feed: Omit<Feed, 'id'>) => {
      const { data, error } = await supabase
        .from('feeds')
        .insert([feed])
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
