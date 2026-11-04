1. DELETE /events/2 returns 204 and the second call returns 404. Is DELETE still idempotent? Explain with what idempotent means.
2. The Vue app on port 5173 calls the API on port 3000. Which program blocks the response when CORS is not configured, and why can curl read it anyway?
3. EventsController never writes new EventsService(). Who creates the service, when, and how many are created?
4. A client sends { "title": "Pitch Night", ..., "booked": 50 }. Which line of code refuses it, and what would happen to booked without it?
5. Why is the “not enough seats” rule in BookingsService and not in BookingsController or only in the Vue form?
