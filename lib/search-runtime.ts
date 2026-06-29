import { Document } from 'flexsearch';
import { createSearchIndexFromPayload } from '@/lib/search-index-core';
import { makeSearchSnippet } from '@/lib/search-text';
import type { SearchDocumentMeta, SearchHit, SearchIndexPayload } from '@/lib/search-types';

const indexCache = new Map<string, Document>();
const payloadCache = new Map<string, SearchIndexPayload>();

function collectResultIds(
  rawResults: ReturnType<Document['search']>
): string[] {
  if (!Array.isArray(rawResults)) return [];

  const ids = new Set<string>();

  for (const entry of rawResults) {
    if (typeof entry === 'string' || typeof entry === 'number') {
      ids.add(String(entry));
      continue;
    }

    if ('id' in entry && entry.id != null) {
      ids.add(String(entry.id));
      continue;
    }

    if ('result' in entry && Array.isArray(entry.result)) {
      for (const id of entry.result) {
        ids.add(String(id));
      }
    }
  }

  return [...ids];
}

export async function loadSearchIndex(bookId: string): Promise<SearchIndexPayload | null> {
  if (payloadCache.has(bookId)) {
    return payloadCache.get(bookId) ?? null;
  }

  try {
    const response = await fetch(`/search/${bookId}.json`);
    if (!response.ok) return null;

    const payload = (await response.json()) as SearchIndexPayload;
    payloadCache.set(bookId, payload);
    indexCache.set(bookId, createSearchIndexFromPayload(payload));
    return payload;
  } catch {
    return null;
  }
}

export function searchBookContent(
  bookId: string,
  query: string,
  limit = 20
): SearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const payload = payloadCache.get(bookId);
  const index = indexCache.get(bookId);
  if (!payload || !index) return [];

  const ids = collectResultIds(
    index.search(trimmed, {
      limit,
    })
  );

  return ids
    .map((id) => payload.documents[id])
    .filter((doc): doc is SearchDocumentMeta => Boolean(doc))
    .map((doc) => ({
      id: doc.id,
      href: doc.href,
      pageNumber: doc.pageNumber,
      pageTitle: doc.pageTitle,
      chapterTitle: doc.chapterTitle,
      sectionTitle: doc.sectionTitle,
      tags: doc.tags,
      snippet: makeSearchSnippet(doc.text, trimmed),
    }));
}

export function clearSearchRuntimeCache(): void {
  indexCache.clear();
  payloadCache.clear();
}

export function primeSearchIndex(payload: SearchIndexPayload): void {
  payloadCache.set(payload.bookId, payload);
  indexCache.set(payload.bookId, createSearchIndexFromPayload(payload));
}
