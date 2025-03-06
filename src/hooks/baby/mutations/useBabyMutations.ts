
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Baby } from '../types';

export function useBabyMutations() {
  const queryClient = useQueryClient();

  const addBabyMutation = useMutation({
    mutationFn: async (baby: Omit<Baby, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create a new object with the correct field names for the database
      const dbBaby = {
        name: baby.name,
        birthdate: baby.birthDate, // Convert birthDate to birthdate for DB
        color: baby.color,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('babies')
        .insert([dbBaby])
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert back to frontend format
      return {
        ...data,
        birthDate: new Date(data.birthdate)
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['babies'] });
    }
  });

  const editBabyMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Omit<Baby, 'id'>>) => {
      // Create database update object with correct field names
      const dbUpdates: any = { ...updates };
      
      // Handle birthDate specifically
      if (updates.birthDate) {
        dbUpdates.birthdate = updates.birthDate;
        delete dbUpdates.birthDate; // Remove the frontend field
      }

      const { data, error } = await supabase
        .from('babies')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert back to frontend format
      return {
        ...data,
        birthDate: new Date(data.birthdate)
      };
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
