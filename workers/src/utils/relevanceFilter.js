// Phrases that definitively indicate a review is about visiting a physical
// service location rather than the product itself. Used for product searches.
const SERVICE_LOCATION_SIGNALS = [
  'genius bar',
  'service appointment',
  'repair appointment',
  'made an appointment',
  'book an appointment',
  'service center',
  'repair center',
  'repair shop',
  'the technician',
  'at the apple store',
  'at the best buy',
  'walked into the store',
  'came into the store',
  'went to the store',
  'in-store service',
  'the associate helped',
  'the employee helped',
  'the staff at this',
]

export function filterReviewsForCategory(reviews, category) {
  if (category !== 'product' || !reviews?.length) return reviews
  return reviews.filter(r => {
    if (!r.text) return false
    const lower = r.text.toLowerCase()
    return !SERVICE_LOCATION_SIGNALS.some(signal => lower.includes(signal))
  })
}
