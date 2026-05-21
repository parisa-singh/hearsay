export function errorResponse(message, status = 500) {
  return Response.json(
    { error: message, status: 'error' },
    { status }
  )
}
