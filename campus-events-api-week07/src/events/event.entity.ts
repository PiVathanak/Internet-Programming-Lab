// Must match the Category enum in prisma/schema.prisma.
// The DTOs use this list to validate input before it reaches the database.
export const CATEGORIES = ['talk', 'workshop', 'social', 'sport'] as const;
export type Category = (typeof CATEGORIES)[number];
