import { Document, type DocumentData } from 'flexsearch';
import type { SearchDocumentMeta, SearchIndexPayload } from '@/lib/search-types';

type SearchIndexDocument = DocumentData & {
  id: string;
  pageTitle: string;
  chapterTitle: string;
  sectionTitle: string;
  tags: string;
  text: string;
};

export function createSearchIndex(): Document {
  return new Document({
    tokenize: 'full',
    resolution: 4,
    document: {
      id: 'id',
      index: ['pageTitle', 'chapterTitle', 'sectionTitle', 'tags', 'text'],
    },
  });
}

export function exportFlexSearchIndex(index: Document): Record<string, string> {
  const exported: Record<string, string> = {};

  index.export((key, data) => {
    exported[key] = data;
  });

  return exported;
}

export function importFlexSearchIndex(
  index: Document,
  payload: Record<string, string>
): void {
  for (const [key, data] of Object.entries(payload)) {
    index.import(key, data);
  }
}

export function createSearchIndexFromPayload(
  payload: SearchIndexPayload
): Document {
  const index = createSearchIndex();
  importFlexSearchIndex(index, payload.index);
  return index;
}

export function addDocumentsToIndex(
  index: Document,
  documents: SearchDocumentMeta[]
): void {
  for (const doc of documents) {
    const indexed: SearchIndexDocument = {
      id: doc.id,
      pageTitle: doc.pageTitle,
      chapterTitle: doc.chapterTitle,
      sectionTitle: doc.sectionTitle,
      tags: doc.tags.join(' '),
      text: doc.text,
    };
    index.add(indexed);
  }
}
