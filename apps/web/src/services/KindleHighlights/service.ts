import dayjs from "dayjs";
import { prisma } from "../../server/db";
import { KindleEntry } from "./kindleEntry";
import { KindleEntryParsed } from "./kindleEntryParsed";
import { parseKindleEntries, readKindleClipping } from "./parser";
import { organizeKindleEntriesByBookTitle } from "./utils";

export class KindleHighlightsService {
  private readonly userId: string;
  private kindleEntries: Array<KindleEntry>;

  constructor(highlights: string, userId: string) {
    this.userId = userId;
    this.kindleEntries = readKindleClipping(highlights);
  }

  async saveBooks(importId: string): Promise<void> {
    const books = this.getBooks();
    for (let [bookTitle, highlights] of books.entries()) {
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
            importId,
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

      await this.saveHighlights(bookId!, highlights);
      if (existingBook) await this.updateExistingBookHighlightCount(bookId!);
    }
  }

  async saveHighlights(
    bookId: string,
    entry: KindleEntryParsed[]
  ): Promise<void> {
    await Promise.all(
      entry.map(
        (highlight) =>
          new Promise<void>(async (res, rej) => {
            const existingHighlight = await prisma.highlight.findFirst({
              where: {
                bookId: bookId,
                content: highlight.content,
                location: highlight.location,
                page: highlight.page.toString(),
              },
            });
            if (existingHighlight) return res();

            console.log("Highlighted On: ", highlight.dateOfCreation);

            await prisma.highlight.create({
              data: {
                bookId: bookId,
                content: highlight.content,
                location: highlight.location,
                page: highlight.page.toString(),
                highlightedOn: dayjs(highlight.dateOfCreation).toDate(),
              },
            });
            return res();
          })
      )
    );
  }

  private getBooks(): Map<string, KindleEntryParsed[]> {
    const parsedEntries = parseKindleEntries(this.kindleEntries);
    return organizeKindleEntriesByBookTitle(parsedEntries);
  }

  private async updateExistingBookHighlightCount(
    bookId: string
  ): Promise<void> {
    const dbHighlights = await prisma.highlight.findMany({
      where: {
        bookId: bookId,
      },
    });
    await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        totalHighlights: dbHighlights.length,
        lastHighlightedOn: dbHighlights[dbHighlights.length - 1]?.highlightedOn,
      },
    });
  }
}
