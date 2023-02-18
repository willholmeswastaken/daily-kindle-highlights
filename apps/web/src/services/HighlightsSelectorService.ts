import { prisma } from "../server/db";
import { DailyHighlight } from "../types/DailyHighlight";
import { shuffleArray } from "../utils/shuffleArray";

export class HighlightsSelectorService {
  private readonly userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }

  async getRandom(): Promise<DailyHighlight[]> {
    const dailyHighlights: DailyHighlight[] = [];
    const books = await prisma.book.findMany({
      where: {
        userId: this.userId,
      },
    });
    const booksInARandomOrder = shuffleArray(books).splice(0, 5);
    for (const book of booksInARandomOrder) {
      const higlights = await prisma.highlight.findMany({
        where: {
          bookId: book.id,
        },
      });
      const randomHighlight = shuffleArray(higlights)[0];
      dailyHighlights.push({
        title: book.title,
        author: book.author,
        highlight: randomHighlight!.content,
        location: randomHighlight!.location,
      });
    }
    return dailyHighlights;
  }
}
