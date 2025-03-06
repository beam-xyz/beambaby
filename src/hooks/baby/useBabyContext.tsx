
import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { BabyContextType } from './types';
import { useSupabaseStorage } from './useSupabaseStorage';
import { calculateTodaysNapTotal, calculateTodaysFeedTotal, getTodaysRating } from './utils';

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get all state from Supabase storage hook
  const {
    babies,
    naps,
    feeds,
    ratings,
    isLoading,
    addBaby: addBabyToDb,
    editBaby: editBabyInDb,
    deleteBaby: deleteBabyFromDb,
    addNap: addNapToDb,
    deleteNap: deleteNapFromDb,
    addFeed: addFeedToDb,
    deleteFeed: deleteFeedFromDb,
    addRating: addRatingToDb,
  } = useSupabaseStorage();

  // Local state
  const [currentBaby, setCurrentBaby] = useState(babies[0]);
  const [activeNap, setActiveNap] = useState<BabyContextType['activeNap']>();

  // Baby management
  const addBaby = async (baby: Parameters<BabyContextType['addBaby']>[0]) => {
    const newBaby = await addBabyToDb(baby);
    if (babies.length === 0) {
      setCurrentBaby(newBaby);
    }
  };

  const editBaby = async (id: string, updates: Parameters<BabyContextType['editBaby']>[1]) => {
    await editBabyInDb({ id, ...updates });
    if (currentBaby?.id === id) {
      setCurrentBaby(prev => prev ? { ...prev, ...updates } : prev);
    }
  };

  const deleteBaby = async (id: string) => {
    await deleteBabyFromDb(id);
    if (currentBaby?.id === id) {
      const remainingBabies = babies.filter(baby => baby.id !== id);
      setCurrentBaby(remainingBabies.length > 0 ? remainingBabies[0] : undefined);
    }
  };

  const switchBaby = (babyId: string) => {
    const baby = babies.find(b => b.id === babyId);
    if (baby) {
      setCurrentBaby(baby);
    }
  };

  // Nap management
  const startNap = useCallback(() => {
    if (!currentBaby) return;

    const now = new Date();
    const newNap = {
      babyId: currentBaby.id,
      startTime: now,
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate())
    };

    addNapToDb(newNap).then(nap => {
      setActiveNap(nap);
    });
  }, [currentBaby, addNapToDb]);

  const endNap = useCallback(() => {
    if (!activeNap) return;

    const updatedNap = { ...activeNap, endTime: new Date() };
    editBabyInDb({ id: activeNap.id, ...updatedNap });
    setActiveNap(undefined);
  }, [activeNap, editBabyInDb]);

  const value: BabyContextType = {
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
    addNap: addNapToDb,
    deleteNap: deleteNapFromDb,
    addFeed: addFeedToDb,
    deleteFeed: deleteFeedFromDb,
    addRating: addRatingToDb,
    getTodaysFeedTotal: () => calculateTodaysFeedTotal(feeds, currentBaby?.id),
    getTodaysNapTotal: () => calculateTodaysNapTotal(naps, currentBaby?.id),
    getTodaysRating: () => getTodaysRating(ratings, currentBaby?.id)
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
};

export const useBaby = () => {
  const context = useContext(BabyContext);
  if (context === undefined) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
};
