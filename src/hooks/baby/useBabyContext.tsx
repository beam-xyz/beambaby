import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Baby, Nap, Feed, DailyRating, BabyContextType } from './types';
import { generateId, getTodayDate, isSameDay } from '@/utils/babyUtils';
import { loadBabyDataFromStorage, saveBabyDataToStorage } from './storage';
import { calculateTodaysNapTotal, calculateTodaysFeedTotal, getTodaysRating } from './utils';

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
    const data = loadBabyDataFromStorage();
    setBabies(data.babies);
    setCurrentBaby(data.currentBaby);
    setNaps(data.naps);
    setFeeds(data.feeds);
    setRatings(data.ratings);
    setActiveNap(data.activeNap);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveBabyDataToStorage('babies', babies);
  }, [babies]);

  useEffect(() => {
    if (currentBaby) {
      saveBabyDataToStorage('currentBabyId', currentBaby.id);
    }
  }, [currentBaby]);

  useEffect(() => {
    saveBabyDataToStorage('naps', naps);
  }, [naps]);

  useEffect(() => {
    saveBabyDataToStorage('feeds', feeds);
  }, [feeds]);

  useEffect(() => {
    saveBabyDataToStorage('ratings', ratings);
  }, [ratings]);

  useEffect(() => {
    if (activeNap) {
      saveBabyDataToStorage('activeNap', activeNap);
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

  const deleteNap = (id: string) => {
    setNaps(prev => prev.filter(nap => nap.id !== id));
    
    // If this is the active nap, clear it
    if (activeNap?.id === id) {
      setActiveNap(undefined);
    }
  };

  const addFeed = (feedData: Omit<Feed, 'id'>) => {
    const newFeed = { ...feedData, id: generateId() };
    setFeeds(prev => [...prev, newFeed]);
  };

  const deleteFeed = (id: string) => {
    setFeeds(prev => prev.filter(feed => feed.id !== id));
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
    deleteNap,
    addFeed,
    deleteFeed,
    addRating,
    getTodaysFeedTotal: () => calculateTodaysFeedTotal(feeds, currentBaby?.id),
    getTodaysNapTotal: () => calculateTodaysNapTotal(naps, currentBaby?.id),
    getTodaysRating: () => getTodaysRating(ratings, currentBaby?.id)
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
