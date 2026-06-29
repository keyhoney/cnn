import type { Metadata } from 'next';
import { getSpreadData, getAdjacentSpreads } from '@/lib/spread';
import { getTableOfContents, getAllStaticPageParams } from '@/lib/content';
import { notFound } from 'next/navigation';
import { PageContent } from '@/components/viewer/PageContent';
import { PagePane } from '@/components/viewer/PagePane';
import { SpreadView } from '@/components/viewer/SpreadView';
import { ViewerLayout } from '@/components/layout/ViewerLayout';

export async function generateStaticParams() {
  return getAllStaticPageParams();
}

export async function generateMetadata({
  params,
}: {
  params: { bookId: string; chapterId: string; pageId: string };
}): Promise<Metadata> {
  const view = await getSpreadData(params.bookId, params.chapterId, params.pageId);
  if (!view) return { title: '페이지를 찾을 수 없음' };

  const title = view.activeRef.meta.title;
  return {
    title,
    description: `${title} — 고등학교 수학 인터랙티브 교재`,
  };
}

export default async function PageViewer({
  params,
}: {
  params: { bookId: string; chapterId: string; pageId: string };
}) {
  const { bookId, chapterId, pageId } = params;

  const view = await getSpreadData(bookId, chapterId, pageId);
  if (!view) notFound();

  const toc = await getTableOfContents(bookId);
  const { prev, next, current, spreadIndex } = await getAdjacentSpreads(
    bookId,
    chapterId,
    pageId
  );

  const chapter = toc?.chapters.find((c) => c.id === chapterId);
  const section = chapter?.sections.find((s) =>
    s.pages.some((p) => p.id === pageId)
  );
  const progressPercent =
    toc && current ? Math.round((current.pageNumber / toc.totalPages) * 100) : 0;

  return (
    <ViewerLayout
      bookId={bookId}
      chapterId={chapterId}
      pageId={pageId}
      bookTitle={toc?.book.title}
      chapterTitle={chapter?.title}
      sectionTitle={section?.title}
      pageTitle={view.activeRef.meta.title}
      toc={toc}
      progressPercent={progressPercent}
      pageNumber={current?.pageNumber ?? 0}
      totalPages={toc?.totalPages ?? 0}
      spreadIndex={spreadIndex}
      prevHref={prev?.href}
      nextHref={next?.href}
    >
      <SpreadView pageIndex={view.pageIndex} totalPages={view.totalPages}>
        <PagePane
          bookId={view.page.ref.bookId}
          chapterId={view.page.ref.chapterId}
          pageId={view.page.ref.pageId}
          pageNumber={view.page.ref.pageNumber}
          title={view.page.meta.title}
          type={view.page.meta.type}
          side="left"
          isActive
        >
          <PageContent source={view.page.source} />
        </PagePane>
      </SpreadView>
    </ViewerLayout>
  );
}
