
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Baby } from '../types';

export function useBabyMutations() {
  const queryClient = useQueryClient();

  const addBabyMutation = useMutation({
    mutationFn: async (baby: Omit<Baby, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('babies')
        .insert([{
          ...baby,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['babies'] });
    }
  });

  const editBabyMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Omit<Baby, 'id'>>) => {
      const { data, error } = await supabase
        .from('babies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['babies'] });
    }
  });

  const deleteBabyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('babies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['babies'] });
    }
  });

  return {
    addBaby: addBabyMutation.mutateAsync,
    editBaby: editBabyMutation.mutateAsync,
    deleteBaby: deleteBabyMutation.mutateAsync
  };
}
