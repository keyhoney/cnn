import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { NotepadBackground } from '@/lib/notepad';

interface NotepadState {
  backgrounds: Record<string, NotepadBackground>;
}

interface NotepadActions {
  getBackground: (notepadKey: string) => NotepadBackground;
  setBackground: (notepadKey: string, background: NotepadBackground) => void;
}

export type NotepadStore = NotepadState & NotepadActions;

const DEFAULT_BACKGROUND: NotepadBackground = 'lined';

export const useNotepadStore = create<NotepadStore>()(
  devtools(
    (set, get) => ({
      backgrounds: {},

      getBackground: (notepadKey) => get().backgrounds[notepadKey] ?? DEFAULT_BACKGROUND,

      setBackground: (notepadKey, background) =>
        set(
          (state) => ({
            backgrounds: { ...state.backgrounds, [notepadKey]: background },
          }),
          false,
          'notepad/setBackground'
        ),
    }),
    { name: 'notepad-store' }
  )
);
