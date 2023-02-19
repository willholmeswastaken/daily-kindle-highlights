import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { parseDateForDisplay } from "../../../utils/parseDateForDisplay";
import type { HighlightViewModel } from "../../../types/HighlightViewModel";

export const highlightsRouter = createTRPCRouter({
  toggleFavouriteHighlight: protectedProcedure
    .input(z.object({ highlightId: z.string(), favourite: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const highlight = await ctx.prisma.highlight.findFirst({
        where: {
          id: input.highlightId,
          book: {
            userId: ctx.session.user.id,
          },
        },
      });
      if (!highlight) {
        throw new TRPCError({
          message: "Highlight not found",
          code: "NOT_FOUND",
        });
      }
      await ctx.prisma.highlight.update({
        where: {
          id: highlight.id,
        },
        data: {
          isFavourite: input.favourite,
        },
      });
    }),
  getFavourites: protectedProcedure.query(async ({ ctx }) => {
    const favourites = await ctx.prisma.highlight.findMany({
      where: {
        isFavourite: true,
        book: {
          userId: ctx.session.user.id,
        },
      },
      include: {
        book: true,
      },
    });
    return favourites.map(
      (x) =>
        ({
          ...x,
          location: x.location.toString(),
          highlightedOn: parseDateForDisplay(x.highlightedOn),
          bookAuthor: x.book.author,
          bookTitle: x.book.title,
        } as HighlightViewModel)
    );
  }),
});
