import { create } from 'zustand';

interface HepaticState {
  steatosis: number;
  inflammation: number;
  fibrosis: number;
  fib4Score: number;
  qtcInterval: number;
  setHepaticState: (state: Partial<HepaticState>) => void;
}

export const useStore = create<HepaticState>((set) => ({
  steatosis: 0,
  inflammation: 0,
  fibrosis: 0,
  fib4Score: 0,
  qtcInterval: 420,
  setHepaticState: (newState) => set((state) => ({ ...state, ...newState })),
}));
