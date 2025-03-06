
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Baby, Nap, Feed, DailyRating } from '@/types/baby';
import { generateId, getTodayDate, isSameDay } from '@/utils/babyUtils';
import { loadFromStorage, saveToStorage } from '@/utils/storageUtils';

// Types
type BabyContextType = {
  babies: Baby[];
  currentBaby?: Baby;
  naps: Nap[];
  feeds: Feed[];
  ratings: DailyRating[];
  activeNap?: Nap;
  addBaby: (baby: Omit<Baby, 'id'>) => void;
  editBaby: (id: string, baby: Partial<Omit<Baby, 'id'>>) => void;
  deleteBaby: (id: string) => void;
  setCurrentBaby: (babyId: string) => void;
  startNap: () => void;
  endNap: () => void;
  addNap: (nap: Omit<Nap, 'id'>) => void;
  addFeed: (feed: Omit<Feed, 'id'>) => void;
  addRating: (rating: Omit<DailyRating, 'id'>) => void;
  getTodaysFeedTotal: () => number;
  getTodaysNapTotal: () => number;
  getTodaysRating: () => number | undefined;
};

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [babies, setBabies] = useState<Baby[]>([]);
  const [currentBaby, setCurrentBaby] = useState<Baby | undefined>();
  const [naps, setNaps] = useState<Nap[]>([]);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [ratings, setRatings] = useState<DailyRating[]>([]);
  const [activeNap, setActiveNap] = useState<Nap | undefined>();

  // Load data from localStorage on initial render
  useEffect(() => {
    const data = loadFromStorage();
    setBabies(data.babies);
    setCurrentBaby(data.currentBaby);
    setNaps(data.naps);
    setFeeds(data.feeds);
    setRatings(data.ratings);
    setActiveNap(data.activeNap);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToStorage('babies', babies);
  }, [babies]);

  useEffect(() => {
    if (currentBaby) {
      saveToStorage('currentBabyId', currentBaby.id);
    }
  }, [currentBaby]);

  useEffect(() => {
    saveToStorage('naps', naps);
  }, [naps]);

  useEffect(() => {
    saveToStorage('feeds', feeds);
  }, [feeds]);

  useEffect(() => {
    saveToStorage('ratings', ratings);
  }, [ratings]);

  useEffect(() => {
    if (activeNap) {
      saveToStorage('activeNap', activeNap);
    } else {
      localStorage.removeItem('activeNap');
    }
  }, [activeNap]);

  // Actions
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
    
    if (activeNap?.babyId === id) {
      setActiveNap(undefined);
    }
  };

  const switchBaby = (babyId: string) => {
    const baby = babies.find(b => b.id === babyId);
    if (baby) {
      setCurrentBaby(baby);
    }
  };

  const startNap = () => {
    if (!currentBaby) return;

    const now = new Date();
    const newNap: Nap = {
      id: generateId(),
      babyId: currentBaby.id,
      startTime: now,
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate())
    };
    setActiveNap(newNap);
    setNaps(prev => [...prev, newNap]);
  };

  const endNap = () => {
    if (!activeNap) return;

    const updatedNap = { ...activeNap, endTime: new Date() };
    setNaps(prev => 
      prev.map(nap => 
        nap.id === activeNap.id ? updatedNap : nap
      )
    );
    setActiveNap(undefined);
  };

  const addNap = (napData: Omit<Nap, 'id'>) => {
    const newNap = { ...napData, id: generateId() };
    setNaps(prev => [...prev, newNap]);
  };

  const addFeed = (feedData: Omit<Feed, 'id'>) => {
    const newFeed = { ...feedData, id: generateId() };
    setFeeds(prev => [...prev, newFeed]);
  };

  const addRating = (ratingData: Omit<DailyRating, 'id'>) => {
    const today = getTodayDate();
    
    // Check if a rating already exists for today
    const existingTodayRating = ratings.find(
      r => r.babyId === ratingData.babyId && isSameDay(r.date, today)
    );

    if (existingTodayRating) {
      // Update existing rating
      setRatings(prev => 
        prev.map(r => 
          r.id === existingTodayRating.id ? { ...r, rating: ratingData.rating } : r
        )
      );
    } else {
      // Add new rating
      const newRating = { ...ratingData, id: generateId() };
      setRatings(prev => [...prev, newRating]);
    }
  };

  const getTodaysFeedTotal = () => {
    if (!currentBaby) return 0;
    
    const today = getTodayDate();
    return feeds
      .filter(feed => feed.babyId === currentBaby.id && isSameDay(feed.date, today))
      .reduce((total, feed) => total + feed.amount, 0);
  };

  const getTodaysNapTotal = () => {
    if (!currentBaby) return 0;
    
    const today = getTodayDate();
    
    return naps
      .filter(nap => {
        return nap.babyId === currentBaby.id && 
              isSameDay(nap.date, today) && 
              nap.endTime !== undefined;
      })
      .reduce((total, nap) => {
        if (!nap.endTime) return total;
        const napDuration = (nap.endTime.getTime() - nap.startTime.getTime()) / (1000 * 60); // in minutes
        return total + napDuration;
      }, 0);
  };

  const getTodaysRating = () => {
    if (!currentBaby) return undefined;
    
    const today = getTodayDate();
    const todayRating = ratings.find(
      rating => rating.babyId === currentBaby.id && isSameDay(rating.date, today)
    );
    
    return todayRating?.rating;
  };

  const value = {
    babies,
    currentBaby,
    naps,
    feeds,
    ratings,
    activeNap,
    addBaby,
    editBaby,
    deleteBaby,
    setCurrentBaby: switchBaby,
    startNap,
    endNap,
    addNap,
    addFeed,
    addRating,
    getTodaysFeedTotal,
    getTodaysNapTotal,
    getTodaysRating
  };

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
};

export const useBaby = (): BabyContextType => {
  const context = useContext(BabyContext);
  if (context === undefined) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
};
