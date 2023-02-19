import type { KindleEntry } from "./kindleEntry";

const LocationRegex = Object.freeze(/\d+-?\d*/);

export const EntryTypeTranslations = Object.freeze({
  NOTE: ["note", "nota"],
  HIGHLIGHT: ["highlight", "subrayado", "surlignement"],
  BOOKMARK: ["bookmark", "marcador", "signet"],
});

export enum EntryType {
  Note = "NOTE",
  Highlight = "HIGHLIGHT",
  Bookmark = "BOOKMARK",
}

interface KindleEntryMetadata {
  page: string;
  location: number;
  dateOfCreation: string;
  type: EntryType;
}

export class KindleEntryParsed {
  private kindleEntry: KindleEntry;
  authors: string;
  bookTitle: string;
  page: string;
  location: number;
  dateOfCreation: string;
  type: EntryType;
  content: string;

  constructor(kindleEntry: KindleEntry) {
    this.kindleEntry = kindleEntry;
    if (kindleEntry.contentClipp.length === 0) {
      this.content = "No content";
    } else {
      this.content = kindleEntry.contentClipp;
    }
    this.authors = this.parseAuthor();
    this.bookTitle = this.parseBook();
    const parsedMetadata = this.parseMetadata();
    this.page = parsedMetadata.page;
    this.location = parsedMetadata.location;
    this.dateOfCreation = parsedMetadata.dateOfCreation;
    this.type = parsedMetadata.type;
    if (this.type === EntryType.Bookmark) {
      // Add placeholer for the content
      this.content = "No content";
    }
  }

  parseAuthor(): string {
    const bookTitleAndAuthors: string = this.kindleEntry.bookTitleAndAuthors;
    let ocurrenceIndex: number = bookTitleAndAuthors.indexOf("(");

    if (ocurrenceIndex === -1) {
      throw new Error(
        `Could not parse author from bookTitleAndAuthors of KindleEntry: ${bookTitleAndAuthors}`
      );
    }

    let nextOcurrenceIndex: number = bookTitleAndAuthors.indexOf(
      "(",
      ocurrenceIndex + 1
    );
    for (
      ;
      nextOcurrenceIndex !== -1 &&
      nextOcurrenceIndex < bookTitleAndAuthors.length;

    ) {
      ocurrenceIndex = nextOcurrenceIndex;
      nextOcurrenceIndex = bookTitleAndAuthors.indexOf("(", ocurrenceIndex + 1);
    }

    const closingParenthesesIndex: number = bookTitleAndAuthors.indexOf(
      ")",
      ocurrenceIndex
    );
    const authors: string = bookTitleAndAuthors.substring(
      ocurrenceIndex + 1,
      closingParenthesesIndex
    );

    if (!authors.includes(",")) {
      return authors;
    }

    // todo: I know this is inefficient, need to refactor.
    const returningAuthors: string = authors
      .split(",")
      .map((x) => x.trim())
      .reduceRight((acc, val) => (acc += ` ${val}`))
      .trim();
    return returningAuthors;
  }

  parseBook() {
    const bookTitleAndAuthors: string = this.kindleEntry.bookTitleAndAuthors;
    let firstOccurrenceIndex: number = bookTitleAndAuthors.indexOf("(");
    let nextOccurrenceIndex: number = bookTitleAndAuthors.indexOf(
      "(",
      firstOccurrenceIndex + 1
    );
    let lastIndex: number = firstOccurrenceIndex;
    for (; nextOccurrenceIndex !== -1; ) {
      lastIndex = firstOccurrenceIndex;
      firstOccurrenceIndex = bookTitleAndAuthors.indexOf(
        "(",
        firstOccurrenceIndex + 1
      );
      if (firstOccurrenceIndex === -1) {
        firstOccurrenceIndex = lastIndex;
      }
      nextOccurrenceIndex = bookTitleAndAuthors.indexOf(
        "(",
        firstOccurrenceIndex + 1
      );
    }
    const bookTitle: string = bookTitleAndAuthors.substring(
      0,
      firstOccurrenceIndex
    );
    return bookTitle.trim();
  }

  parseMetadata(): KindleEntryMetadata {
    const metadata = this.kindleEntry.metdataClipp;
    const indexOfFirstSeparator = metadata.indexOf("|");
    const indexOfSecondSeparator = metadata.indexOf(
      "|",
      indexOfFirstSeparator + 1
    );

    const hasPageMetadata = indexOfSecondSeparator !== -1;

    let pageMetadata: string;
    let locationMetadata: string;
    let dateOfCreation: string;

    if (indexOfFirstSeparator === -1) {
      throw new Error(`Could not parse metadata of: ${metadata}`);
    }

    // Obtaining separated strings
    if (!hasPageMetadata) {
      // Doesnt have page count
      locationMetadata = metadata.substring(0, indexOfFirstSeparator).trim();
      dateOfCreation = metadata.substring(indexOfFirstSeparator + 1).trim();
    } else {
      pageMetadata = metadata.substring(0, indexOfFirstSeparator).trim();
      locationMetadata = metadata
        .substring(indexOfFirstSeparator + 1, indexOfSecondSeparator)
        .trim();
      dateOfCreation = metadata.substring(indexOfSecondSeparator + 1).trim();
    }

    const page: string = hasPageMetadata ? this.parsePage(pageMetadata!) : "0";
    const location = this.parseLocation(locationMetadata);
    const dateOfCreationParsed = this.parseDateOfCreation(dateOfCreation);
    const type = hasPageMetadata
      ? this.parseEntryType(pageMetadata!)
      : this.parseEntryType(locationMetadata);

    return {
      page,
      location,
      dateOfCreation: dateOfCreationParsed,
      type,
    };
  }

  parsePage(pageMetadata: string) {
    const matchPage: RegExpExecArray | null | undefined = /\d+/.exec(
      pageMetadata
    );
    if (!matchPage) {
      return "Unknown";
    }
    const page = Number(matchPage[0]);
    if (isNaN(page)) {
      return "Unknown";
    }
    return page.toString();
  }

  parseLocation(locationMetadata: string) {
    const matchLocation: RegExpExecArray | null | undefined =
      LocationRegex.exec(locationMetadata);
    if (!matchLocation) {
      throw new Error(
        `Can't parse location from locationMetadataStr: ${locationMetadata}`
      );
    }
    const location = parseInt(matchLocation[0]!.split("-")[0]!.trim());
    return location;
  }

  parseDateOfCreation(dateMetadata: string): string {
    return dateMetadata.split(",")[1]?.trim() ?? "";
  }

  parseEntryType(pageMetadata: string): EntryType {
    const pageMetaddataLowerCase: string = pageMetadata.toLowerCase();
    let isTypeNote = false;
    let isTypeHighlight = false;
    let isTypeBookmark = false;
    for (const noteTranslation of EntryTypeTranslations.NOTE) {
      if (pageMetaddataLowerCase.includes(noteTranslation)) {
        isTypeNote = true;
        break;
      }
    }

    if (isTypeNote) {
      return EntryType.Note;
    }

    for (const highlightTranslation of EntryTypeTranslations.HIGHLIGHT) {
      if (pageMetaddataLowerCase.includes(highlightTranslation)) {
        isTypeHighlight = true;
        break;
      }
    }

    if (isTypeHighlight) {
      return EntryType.Highlight;
    }

    for (const bookMarkTranslation of EntryTypeTranslations.BOOKMARK) {
      if (pageMetaddataLowerCase.includes(bookMarkTranslation)) {
        isTypeBookmark = true;
        break;
      }
    }

    if (isTypeBookmark) {
      return EntryType.Bookmark;
    } else {
      throw new Error(
        `Couldn't parse type of Entry: pageMetadataStr: ${pageMetadata}`
      );
    }
  }

  toJSON() {
    return {
      authors: this.authors,
      bookTile: this.bookTitle,
      page: this.page,
      location: this.location,
      dateOfCreation: this.dateOfCreation,
      content: this.content,
      type: this.type,
    };
  }
}
