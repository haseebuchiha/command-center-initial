import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CommandCenterStore = {
  visitedPages: string[];
  markPageVisited: (page: string) => void;
  dismissedNudges: string[];
  dismissNudge: (id: string) => void;
  confetti: boolean;
  triggerConfetti: () => void;
};

export const useCommandCenterStore = create<CommandCenterStore>()(
  persist(
    (set) => ({
      visitedPages: [],
      markPageVisited: (page) =>
        set((state) => ({
          visitedPages: state.visitedPages.includes(page)
            ? state.visitedPages
            : [...state.visitedPages, page],
        })),
      dismissedNudges: [],
      dismissNudge: (id) =>
        set((state) => ({
          dismissedNudges: [...state.dismissedNudges, id],
        })),
      confetti: false,
      triggerConfetti: () => {
        set({ confetti: true });
        setTimeout(() => set({ confetti: false }), 4000);
      },
    }),
    { name: 'launchbased-ui' }
  )
);
