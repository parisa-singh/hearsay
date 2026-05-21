import { useUIStore } from '../store/uiStore'
import { PLATFORMS } from '../constants/platforms'

export function usePlatformToggles() {
  const { selectedPlatforms, togglePlatform, isPlatformEnabled } = useUIStore()

  const enabledPlatforms = PLATFORMS.filter(p => isPlatformEnabled(p.id))

  return {
    platforms: PLATFORMS,
    enabledPlatforms,
    selectedPlatforms,
    togglePlatform,
    isPlatformEnabled,
  }
}
