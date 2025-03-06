
// Re-export everything from the hook file for backward compatibility
import { BabyProvider, useBaby } from '@/hooks/baby/useBabyContext';
import { Baby, Nap, Feed, DailyRating } from '@/hooks/baby/types';

export { BabyProvider, useBaby };
export type { Baby, Nap, Feed, DailyRating };
