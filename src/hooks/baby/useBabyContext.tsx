
import React, { createContext, useContext, ReactNode } from 'react';
import { BabyContextType } from './types';
import { useStorage } from './useStorage';
import { useBabyManager } from './useBabyManager';
import { useNapManager } from './useNapManager';
import { useFeedManager } from './useFeedManager';
import { useRatingManager } from './useRatingManager';
import { calculateTodaysNapTotal, calculateTodaysFeedTotal, getTodaysRating } from './utils';

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get all state from storage hook
  const {
    babies, setBabies,
    currentBaby, setCurrentBaby,
    naps, setNaps,
    feeds, setFeeds,
    ratings, setRatings,
    activeNap, setActiveNap
  } = useStorage();

  // Use specialized manager hooks
  const { addBaby, editBaby, deleteBaby, switchBaby } = useBabyManager(
    babies, setBabies, currentBaby, setCurrentBaby, setNaps, setFeeds, setRatings, setActiveNap
  );
  
  const { startNap, endNap, addNap, deleteNap } = useNapManager(
    currentBaby, activeNap, setActiveNap, naps, setNaps
  );
  
  const { addFeed, deleteFeed } = useFeedManager(feeds, setFeeds);
  
  const { addRating } = useRatingManager(ratings, setRatings);

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
