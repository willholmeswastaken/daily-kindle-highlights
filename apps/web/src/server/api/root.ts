import { createTRPCRouter } from "./trpc";
import { booksRouter } from "./routers/books";
import { highlightsRouter } from "./routers/highlights";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  books: booksRouter,
  highlights: highlightsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
