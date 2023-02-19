import dayjs from "dayjs";
import type { Highlight } from "@prisma/client";
import type { Logger } from "pino";

import { prisma } from "../../server/db";
import type { KindleEntry } from "./kindleEntry";
import type { KindleEntryParsed } from "./kindleEntryParsed";
import { parseKindleEntries, readKindleClipping } from "./parser";
import { organizeKindleEntriesByBookTitle } from "./utils";
import { logger } from "../../utils/logger";

export class KindleHighlightsService {
  private readonly userId: string;
  private readonly kindleEntries: Array<KindleEntry>;
  private importId: string | undefined;

  private logger: Logger | undefined;

  constructor(highlights: string, userId: string) {
    this.userId = userId;
    this.kindleEntries = readKindleClipping(highlights);
  }

  async saveBooks(importId: string): Promise<void> {
    this.importId = importId;
    const books = this.getBooks();
    const tasks: Array<Promise<void>> = [];

    this.logger = logger.child({ importId });
    this.logger.info("Building up tasks for import");

    for (const [bookTitle, highlights] of books.entries()) {
      tasks.push(this.upsertBookAndHighlights(bookTitle, highlights));
    }

    await Promise.all(tasks);
    this.logger.info("All tasks completed for import");
  }

  private getBooks(): Map<string, KindleEntryParsed[]> {
    const parsedEntries = parseKindleEntries(this.kindleEntries);
    return organizeKindleEntriesByBookTitle(parsedEntries);
  }

  private async saveHighlights(
    bookId: string,
    highlights: KindleEntryParsed[]
  ): Promise<void> {
    const highlightsToSave: HighlightToSave[] = [];
    const existingHighlights = await prisma.highlight.findMany({
      where: {
        bookId: bookId,
      },
    });
    for (const highlight of highlights) {
      if (
        existingHighlights.find(
          (h) =>
            h.content === highlight.content &&
            h.location === highlight.location &&
            h.page === highlight.page.toString()
        )
      ) {
        continue;
      }

      highlightsToSave.push({
        bookId: bookId,
        content: highlight.content,
        location: highlight.location,
        page: highlight.page.toString(),
        highlightedOn: dayjs(highlight.dateOfCreation).toDate(),
        isFavourite: false,
      });
    }

    this.logger?.info(
      { bookId, highlightsToSave: highlightsToSave.length },
      "Saving highlights for book"
    );

    await prisma.highlight.createMany({
      data: highlightsToSave,
    });
  }

  private async updateExistingBookHighlightCount(
    bookId: string
  ): Promise<void> {
    await prisma.$transaction(async (db) => {
      const dbHighlights = await db.highlight.findMany({
        where: {
          bookId: bookId,
        },
      });
      await db.book.update({
        where: {
          id: bookId,
        },
        data: {
          totalHighlights: dbHighlights.length,
          lastHighlightedOn:
            dbHighlights[dbHighlights.length - 1]?.highlightedOn,
        },
      });
    });
  }

  private async upsertBookAndHighlights(
    bookTitle: string,
    highlights: KindleEntryParsed[]
  ): Promise<void> {
    const existingBook = await prisma.book.findFirst({
      where: {
        title: bookTitle,
        userId: this.userId,
      },
    });

    let bookId = existingBook?.id;
    if (!existingBook) {
      const book = await prisma.book.create({
        data: {
          title: bookTitle,
          importId: this.importId!,
          author: highlights[0]?.authors ?? "",
          totalHighlights: highlights.length,
          userId: this.userId,
          lastHighlightedOn: dayjs(
            highlights[highlights.length - 1]?.dateOfCreation
          ).toDate(),
        },
      });
      bookId = book.id;
    }
    this.logger?.info({ bookTitle, bookId }, "Inserting highlights for book");
    await this.saveHighlights(bookId!, highlights);
    this.logger?.info({ bookTitle, bookId }, "Highlights inserted for book");

    if (existingBook) {
      await this.updateExistingBookHighlightCount(bookId!);
      this.logger?.info(
        { bookTitle, bookId },
        "Updated existing highlight count for book."
      );
    }
  }
}

type HighlightToSave = Omit<Highlight, "id">;
