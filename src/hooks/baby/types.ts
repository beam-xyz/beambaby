
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

export type BabyContextType = {
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
  deleteNap: (id: string) => void;
  addFeed: (feed: Omit<Feed, 'id'>) => void;
  deleteFeed: (id: string) => void;
  addRating: (rating: Omit<DailyRating, 'id'>) => void;
  getTodaysFeedTotal: () => number;
  getTodaysNapTotal: () => number;
  getTodaysRating: () => number | undefined;
};
