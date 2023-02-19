import type { HighlightViewModel } from "./HighlightViewModel";

export type BookReview = {
  title: string;
  author: string;
  highlights: HighlightViewModel[];
};
