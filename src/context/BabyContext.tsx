
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Types
export type Baby = {
  id: string;
  name: string;
  birthDate: Date;
  imageUrl?: string;
  color: 'blue' | 'pink' | 'mint' | 'lavender' | 'peach';
};

export type Nap = {
  id: string;
  babyId: string;
  startTime: Date;
  endTime?: Date;
  date: Date;
};

export type Feed = {
  id: string;
  babyId: string;
  amount: number; // in oz
  time: Date;
  date: Date;
};

export type DailyRating = {
  id: string;
  babyId: string;
  rating: number; // 1-10
  date: Date;
};

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

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Get today's date at midnight for easy comparison
const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Compare two dates to see if they are the same day
const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

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
    const storedBabies = localStorage.getItem('babies');
    const storedNaps = localStorage.getItem('naps');
    const storedFeeds = localStorage.getItem('feeds');
    const storedRatings = localStorage.getItem('ratings');
    const storedCurrentBabyId = localStorage.getItem('currentBabyId');
    const storedActiveNap = localStorage.getItem('activeNap');

    if (storedBabies) {
      const parsedBabies = JSON.parse(storedBabies) as Baby[];
      // Convert string dates back to Date objects
      parsedBabies.forEach(baby => {
        baby.birthDate = new Date(baby.birthDate);
      });
      setBabies(parsedBabies);

      if (storedCurrentBabyId) {
        const currentBaby = parsedBabies.find(baby => baby.id === storedCurrentBabyId);
        setCurrentBaby(currentBaby);
      } else if (parsedBabies.length > 0) {
        setCurrentBaby(parsedBabies[0]);
      }
    }

    if (storedNaps) {
      const parsedNaps = JSON.parse(storedNaps) as Nap[];
      // Convert string dates back to Date objects
      parsedNaps.forEach(nap => {
        nap.startTime = new Date(nap.startTime);
        if (nap.endTime) nap.endTime = new Date(nap.endTime);
        nap.date = new Date(nap.date);
      });
      setNaps(parsedNaps);
    }

    if (storedFeeds) {
      const parsedFeeds = JSON.parse(storedFeeds) as Feed[];
      // Convert string dates back to Date objects
      parsedFeeds.forEach(feed => {
        feed.time = new Date(feed.time);
        feed.date = new Date(feed.date);
      });
      setFeeds(parsedFeeds);
    }

    if (storedRatings) {
      const parsedRatings = JSON.parse(storedRatings) as DailyRating[];
      // Convert string dates back to Date objects
      parsedRatings.forEach(rating => {
        rating.date = new Date(rating.date);
      });
      setRatings(parsedRatings);
    }

    if (storedActiveNap) {
      const parsedActiveNap = JSON.parse(storedActiveNap) as Nap;
      // Convert string dates back to Date objects
      parsedActiveNap.startTime = new Date(parsedActiveNap.startTime);
      if (parsedActiveNap.endTime) parsedActiveNap.endTime = new Date(parsedActiveNap.endTime);
      parsedActiveNap.date = new Date(parsedActiveNap.date);
      setActiveNap(parsedActiveNap);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('babies', JSON.stringify(babies));
  }, [babies]);

  useEffect(() => {
    if (currentBaby) {
      localStorage.setItem('currentBabyId', currentBaby.id);
    }
  }, [currentBaby]);

  useEffect(() => {
    localStorage.setItem('naps', JSON.stringify(naps));
  }, [naps]);

  useEffect(() => {
    localStorage.setItem('feeds', JSON.stringify(feeds));
  }, [feeds]);

  useEffect(() => {
    localStorage.setItem('ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    if (activeNap) {
      localStorage.setItem('activeNap', JSON.stringify(activeNap));
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
