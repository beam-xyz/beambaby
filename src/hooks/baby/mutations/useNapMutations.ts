
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Nap } from '../types';

export function useNapMutations() {
  const queryClient = useQueryClient();

  const addNapMutation = useMutation({
    mutationFn: async (nap: Omit<Nap, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const dbNap = {
        baby_id: nap.babyId,
        starttime: nap.startTime,
        endtime: nap.endTime,
        date: nap.date,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('naps')
        .insert([dbNap])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        babyId: data.baby_id,
        startTime: new Date(data.starttime),
        endTime: data.endtime ? new Date(data.endtime) : undefined,
        date: new Date(data.date)
      };
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
