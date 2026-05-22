const EU = ['GB','IE','DE','FR','IT','ES','NL','SE','NO','DK','FI','AT','BE','CH','PL','PT','GR']
const US_CA = ['US', 'CA']
const SEA = ['TH', 'VN', 'SG', 'MY', 'ID', 'PH']
const MIDDLE_EAST = ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB']
const LATAM = ['BR', 'MX', 'CO', 'AR', 'PE', 'CL', 'EC']

export function getPlatformTiers(countryCode) {
  const code = countryCode?.toUpperCase() ?? null

  if (!code) {
    return { platforms: null }
  }

  if (US_CA.includes(code)) {
    return {
      platforms: ['google', 'yelp', 'tripadvisor', 'facebook', 'opentable', 'nextdoor', 'foursquare'],
    }
  }

  if (EU.includes(code)) {
    return {
      platforms: ['google', 'tripadvisor', 'thefork', 'facebook', 'yelp', 'michelin', 'foursquare'],
    }
  }

  if (code === 'CN') {
    return {
      platforms: ['dianping', 'meituan', 'baidumaps', 'gaode', 'xiaohongshu', 'tripadvisor', 'wechat'],
    }
  }

  if (code === 'IN') {
    return {
      platforms: ['google', 'tripadvisor', 'facebook', 'justdial', 'magicpin', 'zomato', 'swiggy'],
    }
  }

  if (MIDDLE_EAST.includes(code)) {
    return {
      platforms: ['google', 'tripadvisor', 'facebook', 'opentable', 'foursquare', 'zomato', 'talabat'],
    }
  }

  if (SEA.includes(code)) {
    return {
      platforms: ['google', 'tripadvisor', 'facebook', 'grabfood', 'agoda', 'wongnai', 'chope'],
    }
  }

  if (LATAM.includes(code)) {
    return {
      platforms: ['google', 'tripadvisor', 'facebook', 'thefork', 'foursquare', 'rappi', 'degusta'],
    }
  }

  // Default: everything else — show global integrated platforms
  return {
    platforms: ['google', 'yelp', 'youtube', 'trustpilot', 'reddit', 'tripadvisor', 'facebook'],
  }
}
