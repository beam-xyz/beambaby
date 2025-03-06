
import { Nap } from './types';
import { generateId, getTodayDate } from '@/utils/babyUtils';

export function useNapManager(
  currentBaby: { id: string } | undefined,
  activeNap: Nap | undefined,
  setActiveNap: React.Dispatch<React.SetStateAction<Nap | undefined>>,
  naps: Nap[],
  setNaps: React.Dispatch<React.SetStateAction<Nap[]>>
) {
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

  return {
    startNap,
    endNap,
    addNap,
    deleteNap
  };
}
