export const PLATFORMS = [
  {
    id: 'google',
    displayName: 'Google',
    logo: '/hearsay/logos/google.svg',
    endpoint: 'google',
    brandColor: '#4285F4',
    defaultEnabled: true,
    supportsLocation: true,
  },
  {
    id: 'yelp',
    displayName: 'Yelp',
    logo: '/hearsay/logos/yelp.svg',
    endpoint: 'yelp',
    brandColor: '#FF1A1A',
    defaultEnabled: true,
    supportsLocation: true,
  },
  {
    id: 'reddit',
    displayName: 'Reddit',
    logo: '/hearsay/logos/reddit.svg',
    endpoint: 'reddit',
    brandColor: '#FF4500',
    defaultEnabled: true,
    supportsLocation: true,
  },
  {
    id: 'youtube',
    displayName: 'YouTube',
    logo: '/hearsay/logos/youtube.svg',
    endpoint: 'youtube',
    brandColor: '#FF0000',
    defaultEnabled: true,
    supportsLocation: true,
  },
  {
    id: 'tripadvisor',
    displayName: 'TripAdvisor',
    logo: '/hearsay/logos/tripadvisor.svg',
    endpoint: 'tripadvisor',
    brandColor: '#34E0A1',
    defaultEnabled: false, // SerpAPI budget — user opts in
    supportsLocation: true,
  },
  {
    id: 'facebook',
    displayName: 'Facebook',
    logo: '/hearsay/logos/facebook.svg',
    endpoint: 'facebook',
    brandColor: '#1877F2',
    defaultEnabled: false, // SerpAPI budget — user opts in
    supportsLocation: true,
    label: 'Facebook Mentions', // displayed name in cards (not "Facebook Reviews")
  },
  {
    id: 'trustpilot',
    displayName: 'Trustpilot',
    logo: '/hearsay/logos/trustpilot.svg',
    endpoint: 'trustpilot',
    brandColor: '#00B67A',
    defaultEnabled: true,
    supportsLocation: false, // global service only
  },
]

export const PLATFORM_MAP = Object.fromEntries(PLATFORMS.map(p => [p.id, p]))
