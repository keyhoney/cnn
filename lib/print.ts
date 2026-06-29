export type PrintMode = 'viewer' | 'qr';

const PRINT_MODE_ATTR = 'data-print-mode';
const PRINT_DRAWING_ATTR = 'data-print-include-drawing';

export function beginPrint(mode: PrintMode, options?: { includeDrawing?: boolean }) {
  if (typeof document === 'undefined') return;

  document.body.setAttribute(PRINT_MODE_ATTR, mode);

  if (mode === 'viewer') {
    document.documentElement.setAttribute(
      PRINT_DRAWING_ATTR,
      options?.includeDrawing ? 'true' : 'false'
    );
  }
}

export function endPrint() {
  if (typeof document === 'undefined') return;

  document.body.removeAttribute(PRINT_MODE_ATTR);
  document.documentElement.removeAttribute(PRINT_DRAWING_ATTR);
}

export function printViewer(includeDrawing: boolean) {
  beginPrint('viewer', { includeDrawing });
  window.print();
}

export function printQrShare() {
  beginPrint('qr');
  window.print();
}
