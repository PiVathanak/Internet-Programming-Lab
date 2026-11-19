import type { PrismaClient } from '../src/generated/prisma/client.js';

// The same six events as weeks 4 to 6, now stored in PostgreSQL.
export const seedEvents = [
  { title: 'Intro to Hackathons', category: 'talk', startsAt: '2026-11-02T09:00:00.000Z', location: 'Amphi A', capacity: 120, booked: 87, description: 'What a hackathon is, how teams form, and how to pitch in three minutes.' },
  { title: 'Git Workshop', category: 'workshop', startsAt: '2026-11-04T13:30:00.000Z', location: 'Lab 3', capacity: 30, booked: 27, description: 'Branches, pull requests and resolving conflicts. Bring a laptop.' },
  { title: 'Football Friday', category: 'sport', startsAt: '2026-11-06T16:00:00.000Z', location: 'Main field', capacity: 22, booked: 22, description: 'Friendly match, all levels welcome.' },
  { title: 'Welcome Party', category: 'social', startsAt: '2026-11-07T18:00:00.000Z', location: 'Student Hall', capacity: 200, booked: 140, description: 'Food, music and meeting the new students.' },
  { title: 'Vue in Practice', category: 'workshop', startsAt: '2026-11-10T08:00:00.000Z', location: 'Lab 1', capacity: 25, booked: 10, description: 'Build a small single-page app from scratch.' },
  { title: 'Careers in Software', category: 'talk', startsAt: '2026-11-12T10:00:00.000Z', location: 'Amphi B', capacity: 80, booked: 79, description: 'Alumni talk about their first jobs and internships.' },
] as const;

// Empties both tables, restarts the ids at 1, and inserts the seed events.
export async function resetDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.$executeRaw`TRUNCATE "Booking", "Event" RESTART IDENTITY CASCADE`;
  await prisma.event.createMany({ data: [...seedEvents] });
}
