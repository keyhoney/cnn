type HintShortcutHandler = () => boolean;

const hintHandlers = new Map<string, HintShortcutHandler>();
let hintHandlerOrder: string[] = [];

export function registerHintShortcutHandler(problemId: string, handler: HintShortcutHandler): () => void {
  if (!hintHandlers.has(problemId)) {
    hintHandlerOrder.push(problemId);
  }
  hintHandlers.set(problemId, handler);

  return () => {
    hintHandlers.delete(problemId);
    hintHandlerOrder = hintHandlerOrder.filter((id) => id !== problemId);
  };
}

export function triggerHintShortcut(focusedProblemId?: string | null): boolean {
  if (focusedProblemId && hintHandlers.has(focusedProblemId)) {
    if (hintHandlers.get(focusedProblemId)!()) return true;
  }

  for (const problemId of hintHandlerOrder) {
    const handler = hintHandlers.get(problemId);
    if (handler?.()) return true;
  }

  return false;
}

export function clearHintShortcutHandlers(): void {
  hintHandlers.clear();
  hintHandlerOrder = [];
}
