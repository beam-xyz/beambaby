import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Baby, Nap, Feed, DailyRating } from './types';

export function useSupabaseStorage() {
  const queryClient = useQueryClient();

  // Fetch babies data
  const { data: babies = [], isLoading: babiesLoading } = useQuery({
    queryKey: ['babies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('babies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert date strings to Date objects
      return data.map((baby: any) => ({
        ...baby,
        birthDate: new Date(baby.birthDate)
      }));
    }
  });

  // Fetch naps data
  const { data: naps = [], isLoading: napsLoading } = useQuery({
    queryKey: ['naps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('naps')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Convert date strings to Date objects
      return data.map((nap: any) => ({
        ...nap,
        startTime: new Date(nap.startTime),
        endTime: nap.endTime ? new Date(nap.endTime) : undefined,
        date: new Date(nap.date)
      }));
    }
  });

  // Fetch feeds data
  const { data: feeds = [], isLoading: feedsLoading } = useQuery({
    queryKey: ['feeds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Convert date strings to Date objects
      return data.map((feed: any) => ({
        ...feed,
        time: new Date(feed.time),
        date: new Date(feed.date)
      }));
    }
  });

  // Fetch ratings data
  const { data: ratings = [], isLoading: ratingsLoading } = useQuery({
    queryKey: ['ratings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Convert date strings to Date objects
      return data.map((rating: any) => ({
        ...rating,
        date: new Date(rating.date)
      }));
    }
  });

  // Add baby mutation
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

  // Edit baby mutation
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

  // Delete baby mutation
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

  // Add nap mutation
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

  // Delete nap mutation
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

  // Add feed mutation
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

  // Delete feed mutation
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

  // Add rating mutation
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

  // Loading state
  const isLoading = babiesLoading || napsLoading || feedsLoading || ratingsLoading;

  return {
    // Data
    babies,
    naps,
    feeds,
    ratings,
    isLoading,
    
    // Mutations
    addBaby: addBabyMutation.mutateAsync,
    editBaby: editBabyMutation.mutateAsync,
    deleteBaby: deleteBabyMutation.mutateAsync,
    addNap: addNapMutation.mutateAsync,
    deleteNap: deleteNapMutation.mutateAsync,
    addFeed: addFeedMutation.mutateAsync,
    deleteFeed: deleteFeedMutation.mutateAsync,
    addRating: addRatingMutation.mutateAsync,
  };
}
