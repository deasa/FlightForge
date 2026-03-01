import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Bag, Disc, Throw, Unit, UserProfile } from '../types';

interface AppState {
  profile: UserProfile;
  bags: Bag[];
  discs: Disc[];
  throws: Throw[];
  activeBagId: string | null;
  
  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  addBag: (name: string) => void;
  setActiveBag: (id: string) => void;
  addDisc: (disc: Omit<Disc, 'id'>) => void;
  updateDisc: (id: string, updates: Partial<Disc>) => void;
  deleteDisc: (id: string) => void;
  addThrow: (throwLog: Omit<Throw, 'id' | 'date'>) => void;
  deleteThrow: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      profile: {
        unit: 'ft',
        name: 'Player',
        powerTier: 1,
      },
      bags: [{ id: 'default-bag', name: 'Main Bag' }],
      discs: [],
      throws: [],
      activeBagId: 'default-bag',

      updateProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),
      
      addBag: (name) =>
        set((state) => {
          const newBag = { id: uuidv4(), name };
          return { bags: [...state.bags, newBag], activeBagId: newBag.id };
        }),
        
      setActiveBag: (id) => set({ activeBagId: id }),
      
      addDisc: (disc) =>
        set((state) => ({ discs: [...state.discs, { ...disc, id: uuidv4() }] })),
        
      updateDisc: (id, updates) =>
        set((state) => ({
          discs: state.discs.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),
        
      deleteDisc: (id) =>
        set((state) => ({
          discs: state.discs.filter((d) => d.id !== id),
          throws: state.throws.filter((t) => t.discId !== id),
        })),
        
      addThrow: (throwLog) =>
        set((state) => ({
          throws: [
            { ...throwLog, id: uuidv4(), date: new Date().toISOString() },
            ...state.throws,
          ],
        })),
        
      deleteThrow: (id) =>
        set((state) => ({
          throws: state.throws.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'flightforge-storage',
    }
  )
);
