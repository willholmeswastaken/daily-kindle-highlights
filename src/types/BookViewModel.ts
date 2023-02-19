export type BookViewModel = {
  id: string;
  author: string;
  title: string;
  importId: string;
  totalHighlights: number;
  importedOn: string;
  lastHighlightedOn: string | null;
  userId: string;
};
