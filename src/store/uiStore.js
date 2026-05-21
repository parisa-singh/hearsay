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

      // Search history (last 5)
      searchHistory: [],
      addToHistory: (query) => {
        const history = get().searchHistory.filter(q => q !== query)
        set({ searchHistory: [query, ...history].slice(0, 5) })
      },

      // Theme
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        document.documentElement.classList.toggle('dark', next === 'dark')
      },

      // Location
      location: null, // { lat, lng, city, state, country }
      setLocation: (loc) => set({ location: loc }),
      clearLocation: () => set({ location: null }),
    }),
    {
      name: 'hearsay-ui',
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        theme: state.theme,
        location: state.location,
        // Don't persist selectedPlatforms as Set — serialize manually
      }),
    }
  )
)
