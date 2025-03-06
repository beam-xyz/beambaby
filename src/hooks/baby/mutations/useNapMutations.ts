
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Nap } from '../types';

export function useNapMutations() {
  const queryClient = useQueryClient();

  const addNapMutation = useMutation({
    mutationFn: async (nap: Omit<Nap, 'id'>) => {
      const { data, error } = await supabase
        .from('naps')
        .insert([nap])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['naps'] });
    }
  });

  const deleteNapMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('naps')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['naps'] });
    }
  });

  return {
    addNap: addNapMutation.mutateAsync,
    deleteNap: deleteNapMutation.mutateAsync
  };
}
