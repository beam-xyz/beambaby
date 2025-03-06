
import { useBabiesQuery } from './queries/useBabiesQuery';
import { useNapsQuery } from './queries/useNapsQuery';
import { useFeedsQuery } from './queries/useFeedsQuery';
import { useRatingsQuery } from './queries/useRatingsQuery';
import { useBabyMutations } from './mutations/useBabyMutations';
import { useNapMutations } from './mutations/useNapMutations';
import { useFeedMutations } from './mutations/useFeedMutations';
import { useRatingMutations } from './mutations/useRatingMutations';

export function useSupabaseStorage() {
  // Queries
  const { data: babies = [], isLoading: babiesLoading } = useBabiesQuery();
  const { data: naps = [], isLoading: napsLoading } = useNapsQuery();
  const { data: feeds = [], isLoading: feedsLoading } = useFeedsQuery();
  const { data: ratings = [], isLoading: ratingsLoading } = useRatingsQuery();

  // Mutations
  const { addBaby, editBaby, deleteBaby } = useBabyMutations();
  const { addNap, deleteNap } = useNapMutations();
  const { addFeed, deleteFeed } = useFeedMutations();
  const { addRating } = useRatingMutations();

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
    addBaby,
    editBaby,
    deleteBaby,
    addNap,
    deleteNap,
    addFeed,
    deleteFeed,
    addRating,
  };
}
