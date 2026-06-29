/** 상대 경로를 현재 사이트의 절대 URL로 변환 */
export function buildAbsolutePageUrl(path: string): string {
  if (typeof window === 'undefined') {
    return path.startsWith('/') ? path : `/${path}`;
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, window.location.origin).href;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
