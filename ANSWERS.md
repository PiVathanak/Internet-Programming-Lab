## 1.You refresh the browser on /events/2 and the page loads. Which program answered that request in development, and what must the production server do so it still works after deployment?

In development, the Vite dev server answered the request. It has a history API fallback, so for a path that isn't a real file it returns `index.html`, and Vue Router then reads the URL and renders the event page. In production, the server (nginx, Apache, Netlify, etc.) must do the same: serve `index.html` for any route that is not a real static file (for example `try_files $uri /index.html;` in nginx). Without it, a refresh on `/events/2` returns a 404 because no such file exists on the server.

## 2.The guard stops students from opening /events/new. Can a student still create an event? How, and what must stop them?

Yes. The guard only runs in the browser, so a student can skip the UI and send `POST /events` directly to the API with `curl`, Postman, or `fetch` in the DevTools console. The server must stop them: it should authenticate each request, check the user's role, and reject unauthorized requests with 401 or 403. The route guard is only a convenience for hiding the page, not real security.

## 3.EventDetailPage loads its event in a watch on the id with immediate: true, not in onMounted. What bug would onMounted alone cause?

`onMounted` runs only once, when the component is first created. When the user goes from `/events/2` to `/events/3`, Vue Router reuses the same component instance, so `onMounted` does not run again and the page keeps showing event 2 while the URL says 3. A `watch` on the id fixes this because it fires on every id change, and `immediate: true` makes it also run on the first render.

## 4. Why does EventsPage use storeToRefs(store) instead of const { events } = store?

Destructuring a Pinia store copies the current value of `events` into a plain variable, which loses the link to the store. When `fetchAll` later replaces `store.events`, the destructured variable still holds the old (empty) array, so the page never updates. `storeToRefs` returns refs that point at the store's state and getters, so `events` stays reactive. Actions can still be destructured directly because they are plain functions.

## 5. Booking makes two requests: POST the booking, then PATCH the seat count. What happens to the data if the second one fails? How could the server avoid this?

If the PATCH fails, the booking already exists but the event's `booked` count was never increased, so the data is inconsistent: seats look available that are actually taken, and the event can be overbooked. The server can avoid this by doing both steps in one atomic operation, for example a single `POST /events/:id/bookings` endpoint that checks capacity, inserts the booking, and updates the count inside one database transaction (all or nothing). Another option is to not store the count at all and compute it from the number of bookings.
