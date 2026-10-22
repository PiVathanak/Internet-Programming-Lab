1. In EventList, what goes wrong if you use the array index as :key and the list gets filtered while a card has local state (for example an open details panel)?
   -When the list is filtered, the array indexes change. Vue may reuse the wrong component for a different event, causing local state, such as an open details panel, to appear on the wrong card. Use a unique event ID as the :key instead.
2. Why is visible a computed and not a function called from the template? What is the difference when you type in the search box?
   -A computed property caches its result and recalculates only when its reactive dependencies change. A function called in the template runs again whenever the component re-renders. When typing in the search box, visible updates automatically to show only matching events. 3. EventCard emits book instead of changing event.booked. Give two reasons.
   -Separation of concerns: EventCard handles the UI, while the parent component handles booking logic and updates the event data.
   -One-way data flow: Emitting an event allows the parent to validate capacity, update the booking count, and record the booking in myBookings.
3. You write const { booked } = reactive(event); booked++. The page does not change. Why?
   -Destructuring extracts booked into a separate variable, disconnecting it from the reactive object's property tracking. Updating booked no longer updates event.booked. Use event.booked++ or const state = reactive(event); state.booked++ instead.
4. Where does myBookings live, and why not in EventCard or EventList?
   -myBookings lives in the parent component that manages the campus events. It should not live in EventCard or EventList because booking data must be shared across cards and used to calculate the total bookings. Keeping it in the parent provides a single source of truth and makes it easier to persist bookings using localStorage
