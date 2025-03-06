
import { Baby, Nap, Feed, DailyRating } from './types';

export const loadBabyDataFromStorage = () => {
  const storedBabies = localStorage.getItem('babies');
  const storedNaps = localStorage.getItem('naps');
  const storedFeeds = localStorage.getItem('feeds');
  const storedRatings = localStorage.getItem('ratings');
  const storedCurrentBabyId = localStorage.getItem('currentBabyId');
  const storedActiveNap = localStorage.getItem('activeNap');

  let parsedBabies: Baby[] = [];
  let parsedNaps: Nap[] = [];
  let parsedFeeds: Feed[] = [];
  let parsedRatings: DailyRating[] = [];
  let currentBaby: Baby | undefined;
  let activeNap: Nap | undefined;

  if (storedBabies) {
    parsedBabies = JSON.parse(storedBabies) as Baby[];
    // Convert string dates back to Date objects
    parsedBabies.forEach(baby => {
      baby.birthDate = new Date(baby.birthDate);
    });

    if (storedCurrentBabyId) {
      currentBaby = parsedBabies.find(baby => baby.id === storedCurrentBabyId);
    } else if (parsedBabies.length > 0) {
      currentBaby = parsedBabies[0];
    }
  }

  if (storedNaps) {
    parsedNaps = JSON.parse(storedNaps) as Nap[];
    // Convert string dates back to Date objects
    parsedNaps.forEach(nap => {
      nap.startTime = new Date(nap.startTime);
      if (nap.endTime) nap.endTime = new Date(nap.endTime);
      nap.date = new Date(nap.date);
    });
  }

  if (storedFeeds) {
    parsedFeeds = JSON.parse(storedFeeds) as Feed[];
    // Convert string dates back to Date objects
    parsedFeeds.forEach(feed => {
      feed.time = new Date(feed.time);
      feed.date = new Date(feed.date);
    });
  }

  if (storedRatings) {
    parsedRatings = JSON.parse(storedRatings) as DailyRating[];
    // Convert string dates back to Date objects
    parsedRatings.forEach(rating => {
      rating.date = new Date(rating.date);
    });
  }

  if (storedActiveNap) {
    activeNap = JSON.parse(storedActiveNap) as Nap;
    // Convert string dates back to Date objects
    activeNap.startTime = new Date(activeNap.startTime);
    if (activeNap.endTime) activeNap.endTime = new Date(activeNap.endTime);
    activeNap.date = new Date(activeNap.date);
  }

  return {
    babies: parsedBabies,
    currentBaby,
    naps: parsedNaps,
    feeds: parsedFeeds,
    ratings: parsedRatings,
    activeNap
  };
};

export const saveBabyDataToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};
