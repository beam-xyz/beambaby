
import { Feed } from './types';
import { generateId } from '@/utils/babyUtils';

export function useFeedManager(
  feeds: Feed[],
  setFeeds: React.Dispatch<React.SetStateAction<Feed[]>>
) {
  const addFeed = (feedData: Omit<Feed, 'id'>) => {
    const newFeed = { ...feedData, id: generateId() };
    setFeeds(prev => [...prev, newFeed]);
  };

  const deleteFeed = (id: string) => {
    setFeeds(prev => prev.filter(feed => feed.id !== id));
  };

  return {
    addFeed,
    deleteFeed
  };
}
