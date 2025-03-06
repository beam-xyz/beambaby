
import { Baby } from './types';
import { generateId } from '@/utils/babyUtils';

export function useBabyManager(
  babies: Baby[],
  setBabies: React.Dispatch<React.SetStateAction<Baby[]>>,
  currentBaby: Baby | undefined,
  setCurrentBaby: React.Dispatch<React.SetStateAction<Baby | undefined>>,
  setNaps: React.Dispatch<React.SetStateAction<any[]>>,
  setFeeds: React.Dispatch<React.SetStateAction<any[]>>,
  setRatings: React.Dispatch<React.SetStateAction<any[]>>,
  setActiveNap: React.Dispatch<React.SetStateAction<any | undefined>>
) {
  const addBaby = (baby: Omit<Baby, 'id'>) => {
    const newBaby = { ...baby, id: generateId() };
    setBabies(prev => [...prev, newBaby]);
    
    // If this is the first baby, set it as current
    if (babies.length === 0) {
      setCurrentBaby(newBaby);
    }
  };

  const editBaby = (id: string, babyUpdates: Partial<Omit<Baby, 'id'>>) => {
    setBabies(prev => 
      prev.map(baby => 
        baby.id === id ? { ...baby, ...babyUpdates } : baby
      )
    );

    // Update currentBaby if needed
    if (currentBaby?.id === id) {
      setCurrentBaby(prev => prev ? { ...prev, ...babyUpdates } : prev);
    }
  };

  const deleteBaby = (id: string) => {
    setBabies(prev => prev.filter(baby => baby.id !== id));
    
    // If deleting current baby, set another baby as current
    if (currentBaby?.id === id) {
      const remainingBabies = babies.filter(baby => baby.id !== id);
      setCurrentBaby(remainingBabies.length > 0 ? remainingBabies[0] : undefined);
    }

    // Also delete this baby's data
    setNaps(prev => prev.filter(nap => nap.babyId !== id));
    setFeeds(prev => prev.filter(feed => feed.babyId !== id));
    setRatings(prev => prev.filter(rating => rating.babyId !== id));
    
    if (currentBaby?.id === id) {
      setActiveNap(undefined);
    }
  };

  const switchBaby = (babyId: string) => {
    const baby = babies.find(b => b.id === babyId);
    if (baby) {
      setCurrentBaby(baby);
    }
  };

  return {
    addBaby,
    editBaby,
    deleteBaby,
    switchBaby
  };
}
