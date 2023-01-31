import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const booksRouter = createTRPCRouter({
  getBooks: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.book.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getBookHighlights: protectedProcedure
    .input(z.object({ bookId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.book.findMany({
        where: {
          id: input.bookId,
        },
      });
    }),
});
