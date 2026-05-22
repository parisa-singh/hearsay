const EU = ['GB','IE','DE','FR','IT','ES','NL','SE','NO','DK','FI','AT','BE','CH','PL','PT','GR','CZ','RO','HU','SK','HR','BG','SI','EE','LV','LT','LU','MT','CY']
const AU_NZ = ['AU', 'NZ']
const US_CA = ['US', 'CA']

export function getPlatformTiers(countryCode) {
  const code = countryCode?.toUpperCase() ?? null

  if (!code) {
    return {
      primary: ['google', 'yelp', 'reddit', 'youtube', 'trustpilot'],
      secondary: ['tripadvisor', 'facebook'],
    }
  }

  if (US_CA.includes(code)) {
    return {
      primary: ['google', 'yelp', 'reddit', 'youtube', 'trustpilot'],
      secondary: ['tripadvisor', 'facebook'],
    }
  }

  if (EU.includes(code)) {
    return {
      primary: ['google', 'trustpilot', 'youtube', 'reddit', 'tripadvisor'],
      secondary: ['yelp', 'facebook'],
    }
  }

  if (AU_NZ.includes(code)) {
    return {
      primary: ['google', 'youtube', 'trustpilot', 'reddit', 'tripadvisor'],
      secondary: ['yelp', 'facebook'],
    }
  }

  if (code === 'IN') {
    return {
      primary: ['google', 'youtube', 'reddit', 'trustpilot', 'tripadvisor'],
      secondary: ['yelp', 'facebook'],
    }
  }

  // Default: everything else (global / unknown region)
  return {
    primary: ['google', 'youtube', 'trustpilot', 'reddit', 'tripadvisor'],
    secondary: ['yelp', 'facebook'],
  }
}
