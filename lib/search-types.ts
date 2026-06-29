export const SEARCH_INDEX_VERSION = 1 as const;

export interface SearchDocumentMeta {
  id: string;
  bookId: string;
  chapterId: string;
  pageId: string;
  href: string;
  pageNumber: number;
  pageTitle: string;
  chapterTitle: string;
  sectionTitle: string;
  tags: string[];
  text: string;
}

export interface SearchIndexPayload {
  version: typeof SEARCH_INDEX_VERSION;
  bookId: string;
  generatedAt: string;
  documents: Record<string, SearchDocumentMeta>;
  index: Record<string, string>;
}

export interface SearchHit {
  id: string;
  href: string;
  pageNumber: number;
  pageTitle: string;
  chapterTitle: string;
  sectionTitle: string;
  tags: string[];
  snippet: string;
}
