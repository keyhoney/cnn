import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { estimateReadingMinutes } from '@/lib/reading-time';

export interface BookMeta {
  id: string;
  title: string;
  subtitle?: string;
  grade: number;
  coverImage?: string;
  chapters: ChapterMeta[];
}

export interface ChapterMeta {
  id: string;
  title: string;
  sections: SectionMeta[];
}

export interface SectionMeta {
  id: string;
  title: string;
  pages: PageMeta[];
}

/** book.json pages 항목 — 메타(title·type·tags)는 MDX frontmatter에서 로드 */
export type BookJsonPageEntry =
  | string
  | {
      id: string;
      /** @deprecated MDX frontmatter 사용. 하위 호환용 fallback */
      title?: string;
      type?: PageMeta['type'];
      tags?: string[];
    };

export interface BookJsonSection {
  id: string;
  title: string;
  pages: BookJsonPageEntry[];
}

export interface BookJson {
  id: string;
  title: string;
  subtitle?: string;
  grade: number;
  coverImage?: string;
  chapters: Array<{
    id: string;
    title: string;
    sections: BookJsonSection[];
  }>;
}

export interface PageMeta {
  id: string;
  title: string;
  type: 'concept' | 'example' | 'exercise' | 'summary';
  /** MDX 본문 글자수 기반 자동 계산 (getBook 로딩 시) */
  estimatedMinutes?: number;
  tags?: string[];
}

export interface BookOverview {
  id: string;
  title: string;
  grade: number;
  description: string;
}

export interface PageFrontmatter {
  id?: string;
  type?: PageMeta['type'];
  title?: string;
  tags?: string[];
}

export interface PageRef {
  bookId: string;
  chapterId: string;
  sectionId: string;
  pageId: string;
  pageNumber: number;
  href: string;
  meta: PageMeta;
}

export interface TocPageEntry extends PageMeta {
  chapterId: string;
  sectionId: string;
  pageNumber: number;
  href: string;
}

export interface TocSectionEntry {
  id: string;
  title: string;
  pages: TocPageEntry[];
}

export interface TocChapterEntry {
  id: string;
  title: string;
  sections: TocSectionEntry[];
}

export interface TableOfContents {
  bookId: string;
  book: BookMeta;
  chapters: TocChapterEntry[];
  totalPages: number;
}

export interface PageContent {
  source: string;
  body: string;
  frontmatter: PageFrontmatter;
  meta: PageMeta;
  ref: PageRef;
}

const contentDir = path.join(process.cwd(), 'content');

const bookCache = new Map<string, Promise<BookMeta | null>>();

function buildPageHref(bookId: string, chapterId: string, pageId: string): string {
  return `/${bookId}/${chapterId}/${pageId}`;
}

function normalizePageId(entry: BookJsonPageEntry): string {
  return typeof entry === 'string' ? entry : entry.id;
}

function getBookJsonPageFallback(entry: BookJsonPageEntry): {
  title?: string;
  type?: PageMeta['type'];
  tags?: string[];
} {
  if (typeof entry === 'string') return {};
  const { title, type, tags } = entry;
  return { title, type, tags };
}

async function resolvePageMeta(
  bookId: string,
  chapterId: string,
  pageId: string,
  fallback: { title?: string; type?: PageMeta['type']; tags?: string[] } = {}
): Promise<PageMeta> {
  const parsed = await getPageSource(bookId, chapterId, pageId);
  const fm = parsed?.frontmatter ?? {};

  const title = fm.title ?? fallback.title ?? pageId;
  const type = fm.type ?? fallback.type ?? 'concept';
  const tags = fm.tags ?? fallback.tags;
  const estimatedMinutes = parsed ? estimateReadingMinutes(parsed.body) : 1;

  return {
    id: pageId,
    title,
    type,
    ...(tags && tags.length > 0 ? { tags } : {}),
    estimatedMinutes,
  };
}

async function enrichBookFromMdx(raw: BookJson, bookId: string): Promise<BookMeta> {
  const chapters = await Promise.all(
    raw.chapters.map(async (chapter) => ({
      id: chapter.id,
      title: chapter.title,
      sections: await Promise.all(
        chapter.sections.map(async (section) => ({
          id: section.id,
          title: section.title,
          pages: await Promise.all(
            section.pages.map((entry) =>
              resolvePageMeta(
                bookId,
                chapter.id,
                normalizePageId(entry),
                getBookJsonPageFallback(entry)
              )
            )
          ),
        }))
      ),
    }))
  );

  const { id, title, subtitle, grade, coverImage } = raw;
  return { id, title, subtitle, grade, coverImage, chapters };
}

async function loadBook(bookId: string): Promise<BookMeta | null> {
  const filePath = path.join(contentDir, bookId, 'book.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const raw = JSON.parse(data) as BookJson;
    return enrichBookFromMdx(raw, bookId);
  } catch (error) {
    console.error(`Failed to read book.json for ${bookId}:`, error);
    return null;
  }
}

export async function getAllBooks(): Promise<BookOverview[]> {
  const filePath = path.join(contentDir, 'books.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read books.json:', error);
    return [];
  }
}

export async function getBook(bookId: string): Promise<BookMeta | null> {
  if (!bookCache.has(bookId)) {
    bookCache.set(bookId, loadBook(bookId));
  }

  return bookCache.get(bookId)!;
}

/** 교재 전체 페이지를 읽기 순서대로 평탄화 */
export async function getAllPageRefs(bookId: string): Promise<PageRef[]> {
  const book = await getBook(bookId);
  if (!book) return [];

  const refs: PageRef[] = [];
  let pageNumber = 0;

  for (const chapter of book.chapters) {
    for (const section of chapter.sections) {
      for (const page of section.pages) {
        pageNumber += 1;
        refs.push({
          bookId,
          chapterId: chapter.id,
          sectionId: section.id,
          pageId: page.id,
          pageNumber,
          href: buildPageHref(bookId, chapter.id, page.id),
          meta: page,
        });
      }
    }
  }

  return refs;
}

/** 계층형 목차 생성 */
export async function getTableOfContents(bookId: string): Promise<TableOfContents | null> {
  const book = await getBook(bookId);
  if (!book) return null;

  let pageNumber = 0;

  const chapters: TocChapterEntry[] = book.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    sections: chapter.sections.map((section) => ({
      id: section.id,
      title: section.title,
      pages: section.pages.map((page) => {
        pageNumber += 1;
        return {
          ...page,
          chapterId: chapter.id,
          sectionId: section.id,
          pageNumber,
          href: buildPageHref(bookId, chapter.id, page.id),
        };
      }),
    })),
  }));

  return {
    bookId,
    book,
    chapters,
    totalPages: pageNumber,
  };
}

export async function getPageRef(
  bookId: string,
  chapterId: string,
  pageId: string
): Promise<PageRef | null> {
  const refs = await getAllPageRefs(bookId);
  return (
    refs.find((ref) => ref.chapterId === chapterId && ref.pageId === pageId) ?? null
  );
}

export async function getAdjacentPages(
  bookId: string,
  chapterId: string,
  pageId: string
): Promise<{ prev: PageRef | null; next: PageRef | null; current: PageRef | null }> {
  const refs = await getAllPageRefs(bookId);
  const index = refs.findIndex(
    (ref) => ref.chapterId === chapterId && ref.pageId === pageId
  );

  if (index === -1) {
    return { prev: null, next: null, current: null };
  }

  return {
    prev: index > 0 ? refs[index - 1] : null,
    next: index < refs.length - 1 ? refs[index + 1] : null,
    current: refs[index],
  };
}

export async function pageExists(
  bookId: string,
  chapterId: string,
  pageId: string
): Promise<boolean> {
  const filePath = path.join(contentDir, bookId, chapterId, `${pageId}.mdx`);
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/** MDX 원문 + frontmatter 파싱 */
export async function getPageSource(
  bookId: string,
  chapterId: string,
  pageId: string
): Promise<{ source: string; body: string; frontmatter: PageFrontmatter } | null> {
  const filePath = path.join(contentDir, bookId, chapterId, `${pageId}.mdx`);
  try {
    const source = await fs.readFile(filePath, 'utf8');
    const { content: body, data } = matter(source);
    return {
      source,
      body,
      frontmatter: data as PageFrontmatter,
    };
  } catch (error) {
    console.error(`Failed to read page ${pageId}:`, error);
    return null;
  }
}

/** 페이지 메타데이터 + MDX 콘텐츠 통합 로딩 */
export async function getPage(
  bookId: string,
  chapterId: string,
  pageId: string
): Promise<PageContent | null> {
  const ref = await getPageRef(bookId, chapterId, pageId);
  const parsed = await getPageSource(bookId, chapterId, pageId);

  if (!ref || !parsed) return null;

  return {
    source: parsed.source,
    body: parsed.body,
    frontmatter: parsed.frontmatter,
    meta: ref.meta,
    ref,
  };
}

/** @deprecated getPage() 사용 권장 */
export async function getPageContent(bookId: string, chapterId: string, pageId: string) {
  const parsed = await getPageSource(bookId, chapterId, pageId);
  return parsed?.source ?? null;
}

/** generateStaticParams용 전체 페이지 파라미터 */
export async function getAllStaticPageParams(): Promise<
  Array<{ bookId: string; chapterId: string; pageId: string }>
> {
  const books = await getAllBooks();
  const params: Array<{ bookId: string; chapterId: string; pageId: string }> = [];

  for (const book of books) {
    const refs = await getAllPageRefs(book.id);
    for (const ref of refs) {
      const exists = await pageExists(ref.bookId, ref.chapterId, ref.pageId);
      if (exists) {
        params.push({
          bookId: ref.bookId,
          chapterId: ref.chapterId,
          pageId: ref.pageId,
        });
      }
    }
  }

  return params;
}