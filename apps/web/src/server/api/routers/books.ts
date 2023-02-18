import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { parseDateForDisplay } from "../../../utils/parseDateForDisplay";
import { prisma } from "../../db";
import { BookReview } from "../../../types/BookReview";

export const booksRouter = createTRPCRouter({
  getBooks: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.book.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getBook: protectedProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      const book = await prisma.book.findUnique({
        where: {
          id: input.bookId as string,
        },
        include: {
          highlights: {
            orderBy: {
              location: "asc",
            },
          },
        },
      });
      return {
        title: book!.title!,
        author: book!.author!,
        highlights: book!.highlights!.map((x) => ({
          ...x,
          location: x.location.toString(),
          highlightedOn: parseDateForDisplay(x.highlightedOn),
        })),
      } as BookReview;
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
