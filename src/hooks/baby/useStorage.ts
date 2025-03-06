
import { loadBabyDataFromStorage, saveBabyDataToStorage } from './storage';
import { Baby, Nap, Feed, DailyRating } from './types';
import { useEffect, useState } from 'react';

export function useStorage() {
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

  return {
    babies, setBabies,
    currentBaby, setCurrentBaby,
    naps, setNaps,
    feeds, setFeeds,
    ratings, setRatings,
    activeNap, setActiveNap
  };
}
