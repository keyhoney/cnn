import fs from 'fs/promises';
import path from 'path';
import {
  getAllBooks,
  getAllPageRefs,
  getBook,
  getPageSource,
  type PageRef,
} from '@/lib/content';
import { extractSearchableText } from '@/lib/search-text';
import {
  addDocumentsToIndex,
  createSearchIndex,
  exportFlexSearchIndex,
} from '@/lib/search-index-core';
import {
  SEARCH_INDEX_VERSION,
  type SearchDocumentMeta,
  type SearchIndexPayload,
} from '@/lib/search-types';

function buildDocumentId(ref: PageRef): string {
  return `${ref.chapterId}:${ref.pageId}`;
}

export async function collectSearchDocuments(bookId: string): Promise<SearchDocumentMeta[]> {
  const book = await getBook(bookId);
  if (!book) return [];

  const refs = await getAllPageRefs(bookId);
  const chapterTitleById = new Map(book.chapters.map((chapter) => [chapter.id, chapter.title]));
  const sectionTitleById = new Map(
    book.chapters.flatMap((chapter) =>
      chapter.sections.map((section) => [`${chapter.id}:${section.id}`, section.title] as const)
    )
  );

  const documents: SearchDocumentMeta[] = [];

  for (const ref of refs) {
    const parsed = await getPageSource(ref.bookId, ref.chapterId, ref.pageId);
    if (!parsed) continue;

    const text = extractSearchableText(parsed.source, parsed.body);
    const tags = ref.meta.tags ?? [];

    documents.push({
      id: buildDocumentId(ref),
      bookId: ref.bookId,
      chapterId: ref.chapterId,
      pageId: ref.pageId,
      href: ref.href,
      pageNumber: ref.pageNumber,
      pageTitle: ref.meta.title,
      chapterTitle: chapterTitleById.get(ref.chapterId) ?? ref.chapterId,
      sectionTitle: sectionTitleById.get(`${ref.chapterId}:${ref.sectionId}`) ?? ref.sectionId,
      tags,
      text,
    });
  }

  return documents;
}

export function buildSearchIndexPayload(documents: SearchDocumentMeta[]): SearchIndexPayload {
  const index = createSearchIndex();
  const documentMap: Record<string, SearchDocumentMeta> = {};

  for (const doc of documents) {
    documentMap[doc.id] = doc;
  }

  addDocumentsToIndex(index, documents);

  return {
    version: SEARCH_INDEX_VERSION,
    bookId: documents[0]?.bookId ?? '',
    generatedAt: new Date().toISOString(),
    documents: documentMap,
    index: exportFlexSearchIndex(index),
  };
}

export async function writeSearchIndexFile(
  bookId: string,
  outputDir = path.join(process.cwd(), 'public', 'search')
): Promise<string> {
  const documents = await collectSearchDocuments(bookId);
  const payload = buildSearchIndexPayload(documents);

  await fs.mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `${bookId}.json`);
  await fs.writeFile(filePath, JSON.stringify(payload), 'utf8');

  return filePath;
}

export async function buildAllSearchIndexes(
  outputDir = path.join(process.cwd(), 'public', 'search')
): Promise<string[]> {
  const books = await getAllBooks();
  const paths: string[] = [];

  for (const book of books) {
    const filePath = await writeSearchIndexFile(book.id, outputDir);
    paths.push(filePath);
  }

  return paths;
}
