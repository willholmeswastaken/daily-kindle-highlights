export type HighlightViewModel = {
  id: string;
  content: string;
  page: string | null;
  location: string;
  bookId: string;
  highlightedOn: string | null;
  isFavourite: boolean;
  bookAuthor?: string;
  bookTitle?: string;
};
