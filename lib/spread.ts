import {
  getAdjacentPages,
  getAllPageRefs,
  getPage,
  type PageContent,
  type PageRef,
} from '@/lib/content';

export interface SpreadData {
  pageIndex: number;
  totalPages: number;
  activeRef: PageRef;
  page: PageContent;
}

/** 현재 페이지 뷰 데이터 (단일 페이지) */
export async function getSpreadData(
  bookId: string,
  chapterId: string,
  pageId: string
): Promise<SpreadData | null> {
  const refs = await getAllPageRefs(bookId);
  const activeIndex = refs.findIndex(
    (ref) => ref.chapterId === chapterId && ref.pageId === pageId
  );

  if (activeIndex === -1) return null;

  const activeRef = refs[activeIndex];
  const page = await getPage(bookId, chapterId, pageId);
  if (!page) return null;

  return {
    pageIndex: activeIndex,
    totalPages: refs.length,
    activeRef,
    page,
  };
}

/** 이전/다음 페이지 (단일 페이지 단위) */
export async function getAdjacentSpreads(
  bookId: string,
  chapterId: string,
  pageId: string
): Promise<{
  prev: PageRef | null;
  next: PageRef | null;
  current: PageRef | null;
  spreadIndex: number;
  totalSpreads: number;
}> {
  const refs = await getAllPageRefs(bookId);
  const { prev, next, current } = await getAdjacentPages(bookId, chapterId, pageId);
  const activeIndex = refs.findIndex(
    (ref) => ref.chapterId === chapterId && ref.pageId === pageId
  );

  if (activeIndex === -1) {
    return { prev: null, next: null, current: null, spreadIndex: 0, totalSpreads: 0 };
  }

  return {
    prev,
    next,
    current,
    spreadIndex: activeIndex,
    totalSpreads: refs.length,
  };
}
