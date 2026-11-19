1. Why does Booking have an eventId column but Event has no bookingIds column? Where is the “many” side of a 1-N relation stored?
In relational databases like PostgreSQL, every column in a table must hold a single, atomic value rather than an array of multiple IDs. Therefore, the "many" side of a one-to-many (1-N) relationship is always stored on the child table (Booking) using a foreign key (eventId) that points back to the parent record's primary key (Event.id). This keeps the schema normalized and allows the database to enforce referential integrity (such as ON DELETE CASCADE).   


2. booked repeats information we could compute with COUNT and SUM over bookings. Why keep it, and what must the code do so it never becomes wrong?
Storing booked directly on the Event table avoids running expensive SUM aggregations across the bookings table every time events are listed, and it makes atomic capacity checks during booking much simpler. To prevent this cached value from drifting out of sync with the actual bookings, every operation that creates, updates, or deletes a booking must increment or decrement booked inside the same database transaction ($transaction).   


3. What is the difference between prisma migrate dev and prisma generate? Which one changes the database?
prisma migrate dev compares your schema.prisma file to your database, generates a .sql migration file, and executes it to update the actual database tables and constraints. prisma generate reads your schema to rebuild the TypeScript types and client code inside your project (src/generated) so your editor and compiler know about your models. Only prisma migrate dev changes the database itself.   


4. A page lists 20 events with their bookings. One version runs 1 query, another runs 21. Name the problem and show how include fixes it.
This is known as the N+1 query problem: the application executes 1 query to fetch the 20 events, followed by 20 separate queries (1 per event) to fetch each event's bookings. Adding include: { bookings: true } to the Prisma query solves this by instructing Prisma to fetch all related bookings up front using a JOIN or a single batched WHERE eventId IN (...) query, reducing the database round-trips from 21 down to 1 or 2.

5. Two students book the last seat at the same moment. Explain step by step why the read-check-update version can sell two seats and why the conditional updateMany cannot.
In the read-check-update version, both requests can read the event concurrently while booked is still capacity - 1, pass the JavaScript check (booked + 1 <= capacity) at the same time, and both increment booked—overselling the event by one seat (a race condition). In contrast, the conditional updateMany pushes the check into a single atomic SQL UPDATE statement with a WHERE clause (booked <= capacity - seats). PostgreSQL locks the row during the update so the first request increments booked to full capacity, and when the second request runs immediately after, the WHERE condition evaluates to false, updating 0 rows and triggering the ConflictException.   
