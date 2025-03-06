
// Re-export everything from the hook file for backward compatibility
import { BabyProvider, useBaby } from '@/hooks/useBabyContext';
import { Baby, Nap, Feed, DailyRating } from '@/types/baby';

export { BabyProvider, useBaby };
export type { Baby, Nap, Feed, DailyRating };
