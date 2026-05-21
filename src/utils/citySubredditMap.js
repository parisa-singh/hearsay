// Maps city names (lowercase) to their primary subreddits for local Reddit searches
export const CITY_SUBREDDITS = {
  'new york': ['nyc', 'newyorkcity'],
  'new york city': ['nyc', 'newyorkcity'],
  'los angeles': ['LosAngeles', 'AskLosAngeles'],
  'chicago': ['chicago'],
  'houston': ['houston'],
  'phoenix': ['phoenix'],
  'philadelphia': ['philadelphia'],
  'san antonio': ['sanantonio'],
  'san diego': ['sandiego'],
  'dallas': ['Dallas'],
  'san francisco': ['sanfrancisco', 'AskSF'],
  'seattle': ['Seattle'],
  'denver': ['Denver'],
  'boston': ['boston'],
  'austin': ['Austin'],
  'nashville': ['nashville'],
  'miami': ['miami'],
  'atlanta': ['Atlanta'],
  'portland': ['Portland'],
  'las vegas': ['vegaslocals'],
  'london': ['london', 'unitedkingdom'],
  'toronto': ['toronto'],
  'sydney': ['sydney', 'australia'],
  'melbourne': ['melbourne'],
  'paris': ['paris'],
  'berlin': ['berlin'],
  'amsterdam': ['Amsterdam'],
  'dubai': ['dubai'],
  'singapore': ['singapore'],
  'tokyo': ['Tokyo', 'japan'],
  'mumbai': ['mumbai', 'india'],
  'delhi': ['delhi', 'india'],
  'bangalore': ['bangalore'],
  'mexico city': ['mexico'],
  'montreal': ['montreal'],
  'vancouver': ['vancouver'],
}

export function getSubredditsForCity(city) {
  if (!city) return []
  const key = city.toLowerCase().trim()
  return CITY_SUBREDDITS[key] ?? []
}
