'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAnimationSettings } from '@/hooks/use-animation-settings';
import { useBookProgress } from '@/hooks/use-book-progress';
import { usePageVisit } from '@/hooks/use-page-visit';
import { useBadgeCheck } from '@/hooks/use-badge-check';
import { usePageNavigation } from '@/hooks/use-page-navigation';
import { useBookmark, useBookmarkList } from '@/hooks/useBookmarks';
import { useViewerKeyboard } from '@/hooks/use-keyboard';
import { PageFlip, setFlipEnterDirection } from '@/components/viewer/PageFlip';
import { TopBar } from '@/components/navigation/TopBar';
import { BottomBar } from '@/components/navigation/BottomBar';
import { TOCSidebar } from '@/components/navigation/TOCSidebar';
import { SearchModal } from '@/components/navigation/SearchModal';
import { BookmarkPanel } from '@/components/navigation/BookmarkPanel';
import { BookmarkMemoDialog } from '@/components/navigation/BookmarkMemoDialog';
import { QRShareModal } from '@/components/navigation/QRShareModal';
import { PrintDialog } from '@/components/print/PrintDialog';
import { NotepadPanel } from '@/components/drawing/NotepadPanel';
import { useBreakpoint } from '@/hooks/use-media';
import { useViewerStore } from '@/stores/viewerStore';
import type { TableOfContents } from '@/lib/content';
import { cn } from '@/lib/utils';

interface ViewerLayoutProps {
  bookId: string;
  chapterId: string;
  pageId: string;
  bookTitle?: string;
  chapterTitle?: string;
  sectionTitle?: string;
  pageTitle: string;
  toc: TableOfContents | null;
  progressPercent: number;
  pageNumber: number;
  totalPages: number;
  spreadIndex?: number;
  prevHref?: string;
  nextHref?: string;
  children: ReactNode;
}

export function ViewerLayout({
  bookId,
  chapterId,
  pageId,
  bookTitle,
  chapterTitle,
  sectionTitle,
  pageTitle,
  toc,
  progressPercent,
  pageNumber,
  totalPages,
  spreadIndex,
  prevHref,
  nextHref,
  children,
}: ViewerLayoutProps) {
  const breakpoint = useBreakpoint();
  const setCurrentPage = useViewerStore((s) => s.setCurrentPage);
  const flipDirection = useViewerStore((s) => s.flipDirection);
  const isTOCOpen = useViewerStore((s) => s.isTOCOpen);
  const isSearchOpen = useViewerStore((s) => s.isSearchOpen);
  const isBookmarkPanelOpen = useViewerStore((s) => s.isBookmarkPanelOpen);
  const isQRShareOpen = useViewerStore((s) => s.isQRShareOpen);
  const [isPrintOpen, setPrintOpen] = useState(false);
  const toggleTOC = useViewerStore((s) => s.toggleTOC);
  const setTOCOpen = useViewerStore((s) => s.setTOCOpen);
  const toggleSearch = useViewerStore((s) => s.toggleSearch);
  const setSearchOpen = useViewerStore((s) => s.setSearchOpen);
  const toggleBookmarkPanel = useViewerStore((s) => s.toggleBookmarkPanel);
  const setBookmarkPanelOpen = useViewerStore((s) => s.setBookmarkPanelOpen);
  const setQRShareOpen = useViewerStore((s) => s.setQRShareOpen);
  const closeAllPanels = useViewerStore((s) => s.closeAllPanels);
  const { animationEnabled } = useAnimationSettings();
  const { bookProgressPercent } = useBookProgress(bookId, toc);
  const { runBadgeCheck } = useBadgeCheck();
  usePageVisit(bookId, pageId);
  const { isBookmarked, toggleBookmark, isLoading: isBookmarkLoading, memoDialogOpen, closeMemoDialog, confirmAddBookmark, memo } = useBookmark(
    bookId,
    pageId
  );
  const { bookmarks } = useBookmarkList(bookId);

  const {
    navigatePrev,
    navigateNext,
    handleExitComplete,
    exitRequested,
    flipDuration,
    bindGestures,
    hasPrev,
    hasNext,
  } = usePageNavigation({ prevHref, nextHref });

  const handleFlipExitComplete = () => {
    setFlipEnterDirection(flipDirection);
    handleExitComplete();
  };

  useEffect(() => {
    setCurrentPage(bookId, pageId);
    closeAllPanels();
    void runBadgeCheck({ type: 'page_visited', bookId, pageId });
  }, [bookId, pageId, setCurrentPage, closeAllPanels, runBadgeCheck]);

  const handleToggleTOC = useCallback(() => {
    if (isSearchOpen) setSearchOpen(false);
    if (isBookmarkPanelOpen) setBookmarkPanelOpen(false);
    if (isQRShareOpen) setQRShareOpen(false);
    toggleTOC();
  }, [isSearchOpen, isBookmarkPanelOpen, isQRShareOpen, setSearchOpen, setBookmarkPanelOpen, setQRShareOpen, toggleTOC]);

  const handleOpenPrint = useCallback(() => {
    if (isTOCOpen) setTOCOpen(false);
    if (isSearchOpen) setSearchOpen(false);
    if (isBookmarkPanelOpen) setBookmarkPanelOpen(false);
    if (isQRShareOpen) setQRShareOpen(false);
    setPrintOpen(true);
  }, [
    isTOCOpen,
    isSearchOpen,
    isBookmarkPanelOpen,
    isQRShareOpen,
    setTOCOpen,
    setSearchOpen,
    setBookmarkPanelOpen,
    setQRShareOpen,
  ]);

  useViewerKeyboard({
    onToggleSearch: toggleSearch,
    onToggleBookmark: toggleBookmark,
    onToggleToc: handleToggleTOC,
    onClosePanels: closeAllPanels,
    onOpenPrint: handleOpenPrint,
    onNavigatePrev: navigatePrev,
    onNavigateNext: navigateNext,
    hasPrev,
    hasNext,
    fallbackPageId: pageId,
  });

  const handleOpenSearch = useCallback(() => {
    if (isTOCOpen) setTOCOpen(false);
    if (isBookmarkPanelOpen) setBookmarkPanelOpen(false);
    if (isQRShareOpen) setQRShareOpen(false);
    setSearchOpen(true);
  }, [isTOCOpen, isBookmarkPanelOpen, isQRShareOpen, setTOCOpen, setBookmarkPanelOpen, setQRShareOpen, setSearchOpen]);

  const handleOpenQRShare = useCallback(() => {
    if (isTOCOpen) setTOCOpen(false);
    if (isSearchOpen) setSearchOpen(false);
    if (isBookmarkPanelOpen) setBookmarkPanelOpen(false);
    setQRShareOpen(true);
  }, [isTOCOpen, isSearchOpen, isBookmarkPanelOpen, setTOCOpen, setSearchOpen, setBookmarkPanelOpen, setQRShareOpen]);

  const handleToggleBookmarkPanel = useCallback(() => {
    if (isTOCOpen) setTOCOpen(false);
    if (isSearchOpen) setSearchOpen(false);
    if (isQRShareOpen) setQRShareOpen(false);
    toggleBookmarkPanel();
  }, [isTOCOpen, isSearchOpen, isQRShareOpen, setTOCOpen, setSearchOpen, setQRShareOpen, toggleBookmarkPanel]);

  const isMobile = breakpoint === 'mobile';
  const spreadKey = spreadIndex ?? 0;
  const settingsHref = `/${bookId}/${chapterId}/${pageId}`;
  const pagePath = `/${bookId}/${chapterId}/${pageId}`;

  return (
    <div
      className={cn(
        'viewer-print-layout relative flex flex-col overflow-hidden font-sans text-app-text',
        'h-[100dvh] min-h-screen select-none'
      )}
    >
      <TopBar
        bookId={bookId}
        bookTitle={bookTitle}
        chapterTitle={chapterTitle}
        sectionTitle={sectionTitle}
        pageTitle={pageTitle}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={navigatePrev}
        onNext={navigateNext}
        onSearch={handleOpenSearch}
        onShareQR={handleOpenQRShare}
        onPrint={handleOpenPrint}
        settingsHref={`/settings?from=${encodeURIComponent(settingsHref)}`}
      />

      <main
        id="main-content"
        className={cn(
          'viewer-print-root perspective-1000 relative flex min-h-0 flex-1 justify-center overflow-hidden',
          isMobile ? 'p-2' : 'p-3 md:p-4',
          breakpoint === 'desktop' && 'lg:px-6'
        )}
        {...bindGestures()}
      >
        {hasPrev && (
          <button
            type="button"
            onClick={navigatePrev}
            data-print-hide
            className="nav-float-btn absolute left-1 top-1/2 z-30 h-11 w-11 -translate-y-1/2 sm:left-2"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            onClick={navigateNext}
            data-print-hide
            className="nav-float-btn absolute right-1 top-1/2 z-30 h-11 w-11 -translate-y-1/2 sm:right-2"
            aria-label="다음 페이지"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
        <PageFlip
          spreadKey={spreadKey}
          animationEnabled={animationEnabled}
          flipDuration={flipDuration}
          exitRequested={exitRequested}
          flipDirection={flipDirection}
          onExitComplete={handleFlipExitComplete}
        >
          {children}
        </PageFlip>
      </main>

      <BottomBar
        progressPercent={bookProgressPercent}
        pageNumber={pageNumber}
        totalPages={totalPages}
        isBookmarked={isBookmarked}
        isBookmarkLoading={isBookmarkLoading}
        bookmarkCount={bookmarks.length}
        isBookmarkPanelOpen={isBookmarkPanelOpen}
        onToggleBookmark={toggleBookmark}
        onToggleBookmarkPanel={handleToggleBookmarkPanel}
        onToggleTOC={handleToggleTOC}
        isTOCOpen={isTOCOpen}
      />

      {toc && (
        <>
          <TOCSidebar
            toc={toc}
            chapterId={chapterId}
            pageId={pageId}
            isOpen={isTOCOpen}
            onClose={() => setTOCOpen(false)}
          />
          <SearchModal toc={toc} isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
          <QRShareModal
            isOpen={isQRShareOpen}
            onClose={() => setQRShareOpen(false)}
            pagePath={pagePath}
            pageTitle={pageTitle}
            bookTitle={bookTitle}
          />
          <BookmarkPanel
            toc={toc}
            bookId={bookId}
            currentPageId={pageId}
            isOpen={isBookmarkPanelOpen}
            onClose={() => setBookmarkPanelOpen(false)}
          />
        </>
      )}

      <BookmarkMemoDialog
        isOpen={memoDialogOpen}
        pageTitle={pageTitle}
        initialMemo={memo ?? ''}
        mode="add"
        onClose={closeMemoDialog}
        onSave={(text) => void confirmAddBookmark(text)}
      />
      <PrintDialog
        isOpen={isPrintOpen}
        onClose={() => setPrintOpen(false)}
        pageTitle={pageTitle}
      />
      <NotepadPanel bookId={bookId} pageId={pageId} />
    </div>
  );
}
