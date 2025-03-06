
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
