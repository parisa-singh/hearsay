import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PLATFORMS } from '../constants/platforms'

const defaultEnabled = new Set(
  PLATFORMS.filter(p => p.defaultEnabled).map(p => p.id)
)

export const useUIStore = create(
  persist(
    (set, get) => ({
      // Platform toggles
      selectedPlatforms: defaultEnabled,
      togglePlatform: (id) => {
        const current = new Set(get().selectedPlatforms)
        if (current.has(id)) {
          current.delete(id)
        } else {
          current.add(id)
        }
        set({ selectedPlatforms: current })
      },
      isPlatformEnabled: (id) => get().selectedPlatforms.has(id),

      // Search history (last 20)
      searchHistory: [],
      addToHistory: (query) => {
        const history = get().searchHistory.filter(q => q !== query)
        set({ searchHistory: [query, ...history].slice(0, 20) })
      },
      clearHistory: () => set({ searchHistory: [] }),

      // History sidebar
      historyOpen: false,
      setHistoryOpen: (open) => set({ historyOpen: open }),

      // Theme (kept for persistence compatibility — toggle removed from UI)
      theme: 'dark',

      // Location
      location: null,
      setLocation: (loc) => set({ location: loc }),
      clearLocation: () => set({ location: null }),
    }),
    {
      name: 'hearsay-ui',
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        theme: state.theme,
        location: state.location,
      }),
    }
  )
)
