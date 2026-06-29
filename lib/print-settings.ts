export const PRINT_INCLUDE_DRAWING_KEY = 'cnn-howlearn:printIncludeDrawing';

export function getStoredPrintIncludeDrawing(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    return localStorage.getItem(PRINT_INCLUDE_DRAWING_KEY) === 'true';
  } catch {
    return false;
  }
}

export function persistPrintIncludeDrawing(includeDrawing: boolean): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PRINT_INCLUDE_DRAWING_KEY, String(includeDrawing));
  } catch {
    // private browsing 등
  }
}
