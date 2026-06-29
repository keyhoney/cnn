import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ProblemState {
  answers: Record<string, string>;
  submittedProblems: Set<string>;
  revealedHints: Record<string, number>;
  revealedSolutionSteps: Record<string, number>;
  focusedProblemId: string | null;
}

interface ProblemActions {
  setAnswer: (problemId: string, answer: string) => void;
  clearAnswer: (problemId: string) => void;
  markSubmitted: (problemId: string) => void;
  isSubmitted: (problemId: string) => boolean;
  revealHint: (problemId: string, level: number) => void;
  revealNextHint: (problemId: string, maxHints: number) => void;
  getHintLevel: (problemId: string) => number;
  revealNextSolutionStep: (problemId: string, maxSteps: number) => void;
  revealAllSolutionSteps: (problemId: string, maxSteps: number) => void;
  getSolutionStepLevel: (problemId: string) => number;
  setFocusedProblemId: (problemId: string | null) => void;
  resetProblem: (problemId: string) => void;
  reset: () => void;
}

export type ProblemStore = ProblemState & ProblemActions;

const initialState: ProblemState = {
  answers: {},
  submittedProblems: new Set<string>(),
  revealedHints: {},
  revealedSolutionSteps: {},
  focusedProblemId: null,
};

export const useProblemStore = create<ProblemStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setAnswer: (problemId, answer) =>
        set(
          (state) => ({
            answers: { ...state.answers, [problemId]: answer },
          }),
          false,
          'problem/setAnswer'
        ),

      clearAnswer: (problemId) =>
        set(
          (state) => {
            const { [problemId]: _, ...rest } = state.answers;
            return { answers: rest };
          },
          false,
          'problem/clearAnswer'
        ),

      markSubmitted: (problemId) =>
        set(
          (state) => ({
            submittedProblems: new Set([...state.submittedProblems, problemId]),
          }),
          false,
          'problem/markSubmitted'
        ),

      isSubmitted: (problemId) => get().submittedProblems.has(problemId),

      revealHint: (problemId, level) =>
        set(
          (state) => ({
            revealedHints: {
              ...state.revealedHints,
              [problemId]: Math.max(state.revealedHints[problemId] ?? 0, level),
            },
          }),
          false,
          'problem/revealHint'
        ),

      revealNextHint: (problemId, maxHints) =>
        set(
          (state) => {
            const current = state.revealedHints[problemId] ?? 0;
            if (current >= maxHints) return state;
            return {
              revealedHints: {
                ...state.revealedHints,
                [problemId]: current + 1,
              },
            };
          },
          false,
          'problem/revealNextHint'
        ),

      getHintLevel: (problemId) => get().revealedHints[problemId] ?? 0,

      revealNextSolutionStep: (problemId, maxSteps) =>
        set(
          (state) => {
            const current = state.revealedSolutionSteps[problemId] ?? 0;
            if (current >= maxSteps) return state;
            return {
              revealedSolutionSteps: {
                ...state.revealedSolutionSteps,
                [problemId]: current + 1,
              },
            };
          },
          false,
          'problem/revealNextSolutionStep'
        ),

      revealAllSolutionSteps: (problemId, maxSteps) =>
        set(
          (state) => ({
            revealedSolutionSteps: {
              ...state.revealedSolutionSteps,
              [problemId]: maxSteps,
            },
          }),
          false,
          'problem/revealAllSolutionSteps'
        ),

      getSolutionStepLevel: (problemId) => get().revealedSolutionSteps[problemId] ?? 0,

      setFocusedProblemId: (problemId) =>
        set({ focusedProblemId: problemId }, false, 'problem/setFocusedProblemId'),

      resetProblem: (problemId) =>
        set(
          (state) => {
            const { [problemId]: _, ...answers } = state.answers;
            const { [problemId]: __, ...revealedHints } = state.revealedHints;
            const { [problemId]: ___, ...revealedSolutionSteps } = state.revealedSolutionSteps;
            const submittedProblems = new Set(state.submittedProblems);
            submittedProblems.delete(problemId);

            return { answers, revealedHints, revealedSolutionSteps, submittedProblems };
          },
          false,
          'problem/resetProblem'
        ),

      reset: () =>
        set(
          {
            answers: {},
            submittedProblems: new Set<string>(),
            revealedHints: {},
            revealedSolutionSteps: {},
            focusedProblemId: null,
          },
          false,
          'problem/reset'
        ),
    }),
    { name: 'problem-store' }
  )
);
