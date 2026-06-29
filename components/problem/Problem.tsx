'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  canSubmit,
  createInitialAnswer,
  gradeAnswer,
} from '@/lib/problem-grading';
import { saveProblemResult } from '@/lib/problem-results';
import { calculateStarRating } from '@/lib/problem-stars';
import type { ProblemProps, ProblemUserAnswer } from '@/lib/types/problem';
import { useProblemPage } from '@/components/problem/ProblemPageContext';
import { ProblemFeedback } from '@/components/problem/ProblemFeedback';
import { ConceptTagsPanel } from '@/components/problem/ConceptTagsPanel';
import { HintPanel } from '@/components/problem/HintPanel';
import { SolutionPanel } from '@/components/problem/SolutionPanel';
import { ProblemSubmitBar } from '@/components/problem/ProblemSubmitBar';
import { MCQProblem } from '@/components/problem/MCQProblem';
import { NumericInput } from '@/components/problem/NumericInput';
import { FormulaInput } from '@/components/problem/FormulaInput';
import { FillBlank } from '@/components/problem/FillBlank';
import { TrueFalseProblem } from '@/components/problem/TrueFalseProblem';
import {
  OrderDnD,
  createOrderItems,
  createShuffledOrderItems,
  orderFromShuffledItems,
  type OrderItem,
} from '@/components/problem/OrderDnD';
import { useProblemStore } from '@/stores/problemStore';
import { ProblemTimer } from '@/components/problem/Timer';
import { useBadgeCheck } from '@/hooks/use-badge-check';

const PROBLEM_TYPE_LABELS: Record<ProblemProps['type'], string> = {
  mcq: '객관식',
  numerical: '수치 입력',
  formula: '수식 입력',
  fillblank: '빈칸 채우기',
  truefalse: '참·거짓',
  order: '순서 배열',
};

function isValidProblemProps(props: Partial<ProblemProps>): props is ProblemProps {
  if (!props.id || !props.type || !props.question) return false;

  switch (props.type) {
    case 'mcq':
      return Array.isArray(props.options) && typeof props.answer === 'number';
    case 'numerical':
      return typeof props.answer === 'number';
    case 'formula':
      return typeof props.answer === 'string';
    case 'fillblank':
      return Array.isArray(props.blanks) && props.blanks.length > 0;
    case 'truefalse':
      return typeof props.answer === 'boolean';
    case 'order':
      return Array.isArray(props.items) && props.items.length >= 2;
    default:
      return false;
  }
}

function initOrderState(items: string[]): {
  shuffledItems: OrderItem[];
  userAnswer: ProblemUserAnswer;
} {
  const shuffledItems = createShuffledOrderItems(items);
  return {
    shuffledItems,
    userAnswer: { type: 'order', order: orderFromShuffledItems(shuffledItems) },
  };
}

/**
 * 문제 컨테이너 — 유형별 UI 라우팅, 채점, ProblemResult 저장.
 * MDX: `<Problem id="..." type="mcq" ... />`
 */
export function Problem(
  rawProps: Partial<ProblemProps> & { onAfterSubmit?: () => void }
) {
  const page = useProblemPage();
  const onAfterSubmit = rawProps.onAfterSubmit;
  const markSubmitted = useProblemStore((s) => s.markSubmitted);
  const resetProblem = useProblemStore((s) => s.resetProblem);
  const setFocusedProblemId = useProblemStore((s) => s.setFocusedProblemId);
  const focusedProblemId = useProblemStore((s) => s.focusedProblemId);
  const getHintLevel = useProblemStore((s) => s.getHintLevel);
  const { runBadgeCheck } = useBadgeCheck();

  const { onAfterSubmit: _, ...problemProps } = rawProps;
  const props = problemProps as ProblemProps;
  const valid = isValidProblemProps(problemProps);

  useEffect(() => {
    if (!valid || !page) return;
    page.registerProblem(props.id);
  }, [valid, page, props.id]);

  const [shuffledOrderItems, setShuffledOrderItems] = useState<OrderItem[]>(() =>
    valid && props.type === 'order' ? createOrderItems(props.items) : []
  );

  const [userAnswer, setUserAnswer] = useState<ProblemUserAnswer>(() => {
    if (!valid) return { type: 'mcq', selected: null };
    if (props.type === 'order') {
      const items = createOrderItems(props.items);
      return { type: 'order', order: orderFromShuffledItems(items) };
    }
    return createInitialAnswer(props.type);
  });

  const orderItems = valid && props.type === 'order' ? props.items : null;

  useEffect(() => {
    if (!orderItems) return;
    const shuffled = createShuffledOrderItems(orderItems);
    setShuffledOrderItems(shuffled);
    setUserAnswer({ type: 'order', order: orderFromShuffledItems(shuffled) });
  }, [valid, props.id, orderItems]);

  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [starRating, setStarRating] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [timerEngaged, setTimerEngaged] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const isActiveProblem = focusedProblemId === props.id;
  const hasTimeLimit = valid && props.timeLimit != null && props.timeLimit > 0;

  useEffect(() => {
    if (!isActiveProblem || submitted) return;
    if (startTimeRef.current == null) {
      startTimeRef.current = Date.now();
    }
    if (hasTimeLimit) {
      setTimerEngaged(true);
    }
  }, [isActiveProblem, submitted, hasTimeLimit]);

  const fillBlankCount = useMemo(() => {
    if (!valid || props.type !== 'fillblank') return 0;
    const fromPlaceholder = (props.question.match(/___/g) ?? []).length;
    return Math.max(fromPlaceholder, props.blanks.length);
  }, [valid, props]);

  const syncFillBlankLength = useCallback(
    (values: string[]) => {
      if (!valid || props.type !== 'fillblank') return values;
      const len = fillBlankCount;
      const next = [...values];
      while (next.length < len) next.push('');
      return next.slice(0, len);
    },
    [valid, props, fillBlankCount]
  );

  const handleSubmit = useCallback(async () => {
    if (!valid) return;

    const answerForGrade =
      userAnswer.type === 'fillblank'
        ? { ...userAnswer, values: syncFillBlankLength(userAnswer.values) }
        : userAnswer;

    if (!canSubmit(props, answerForGrade)) return;

    const correct = gradeAnswer(props, answerForGrade);
    const nextAttempt = attemptCount + 1;
    const hintsUsed = getHintLevel(props.id);
    const stars = calculateStarRating(nextAttempt, correct, hintsUsed);

    setAttemptCount(nextAttempt);
    setStarRating(stars);
    setIsCorrect(correct);
    setSubmitted(true);
    markSubmitted(props.id);

    if (page) {
      await saveProblemResult({
        problemId: props.id,
        bookId: page.bookId,
        pageId: page.pageId,
        isCorrect: correct,
        hintsUsed,
        timeSpentMs: Date.now() - (startTimeRef.current ?? Date.now()),
        tags: props.tags ?? [],
      });
      page.notifyProblemSubmitted(props.id);

      void runBadgeCheck({
        type: 'problem_submitted',
        bookId: page.bookId,
        chapterId: page.chapterId,
        pageId: page.pageId,
        problemId: props.id,
        isCorrect: correct,
        hintsUsed,
        timeSpentMs: Date.now() - (startTimeRef.current ?? Date.now()),
        attemptNumber: nextAttempt,
      });
    }

    onAfterSubmit?.();
  }, [
    valid,
    props,
    userAnswer,
    syncFillBlankLength,
    markSubmitted,
    page,
    getHintLevel,
    attemptCount,
    runBadgeCheck,
    onAfterSubmit,
  ]);

  const handleRetry = useCallback(() => {
    if (!valid) return;

    if (props.type === 'order') {
      const next = initOrderState(props.items);
      setShuffledOrderItems(next.shuffledItems);
      setUserAnswer(next.userAnswer);
    } else {
      setUserAnswer(createInitialAnswer(props.type));
    }

    setSubmitted(false);
    setIsCorrect(null);
    setStarRating(0);
    setTimerKey((k) => k + 1);
    setTimerEngaged(false);
    startTimeRef.current = null;
    resetProblem(props.id);
  }, [valid, props, resetProblem]);

  if (!valid) {
    return (
      <div className="surface-card my-6 border-status-warning/30 bg-status-warning-soft p-4 text-sm text-app-text">
        문제 설정이 올바르지 않습니다. (id, type, question, answer 확인)
      </div>
    );
  }

  const submitReady = canSubmit(
    props,
    userAnswer.type === 'fillblank'
      ? { ...userAnswer, values: syncFillBlankLength(userAnswer.values) }
      : userAnswer
  );

  return (
    <div
      className="spectrum-border surface-card relative my-8 scroll-mt-4 p-5 sm:p-6"
      id={props.id}
      data-problem-type={props.type}
      data-no-highlight
      tabIndex={-1}
      onMouseDown={() => setFocusedProblemId(props.id)}
      onFocusCapture={() => setFocusedProblemId(props.id)}
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">{PROBLEM_TYPE_LABELS[props.type]}</span>
          {hasTimeLimit && (
            <ProblemTimer
              key={timerKey}
              totalSeconds={props.timeLimit!}
              running={timerEngaged && isActiveProblem && !submitted}
            />
          )}
        </div>
        {submitted && isCorrect !== null && (
          <ProblemFeedback
            isCorrect={isCorrect}
            stars={starRating}
            hintsUsed={getHintLevel(props.id)}
          />
        )}
      </div>

      <div data-no-flip>
        {props.type === 'mcq' && (
          <MCQProblem
            problemId={props.id}
            question={props.question}
            options={props.options}
            selected={userAnswer.type === 'mcq' ? userAnswer.selected : null}
            answer={props.answer}
            submitted={submitted}
            isCorrect={isCorrect}
            onSelect={(index) => setUserAnswer({ type: 'mcq', selected: index })}
          />
        )}

        {props.type === 'numerical' && (
          <NumericInput
            question={props.question}
            value={userAnswer.type === 'numerical' ? userAnswer.value : ''}
            tolerance={props.tolerance}
            submitted={submitted}
            isCorrect={isCorrect}
            onChange={(value) => setUserAnswer({ type: 'numerical', value })}
          />
        )}

        {props.type === 'formula' && (
          <FormulaInput
            question={props.question}
            value={userAnswer.type === 'formula' ? userAnswer.value : ''}
            submitted={submitted}
            isCorrect={isCorrect}
            onChange={(value) => setUserAnswer({ type: 'formula', value })}
          />
        )}

        {props.type === 'fillblank' && (
          <FillBlank
            question={props.question}
            blankCount={fillBlankCount}
            values={userAnswer.type === 'fillblank' ? syncFillBlankLength(userAnswer.values) : []}
            submitted={submitted}
            isCorrect={isCorrect}
            expectedAnswers={props.blanks}
            onChange={(index, value) =>
              setUserAnswer((prev) => {
                const current =
                  prev.type === 'fillblank' ? syncFillBlankLength(prev.values) : [];
                const next = [...current];
                next[index] = value;
                return { type: 'fillblank', values: next };
              })
            }
          />
        )}

        {props.type === 'truefalse' && (
          <TrueFalseProblem
            question={props.question}
            value={userAnswer.type === 'truefalse' ? userAnswer.value : null}
            answer={props.answer}
            submitted={submitted}
            isCorrect={isCorrect}
            onChange={(value) => setUserAnswer({ type: 'truefalse', value })}
          />
        )}

        {props.type === 'order' && (
          <OrderDnD
            question={props.question}
            items={shuffledOrderItems}
            order={userAnswer.type === 'order' ? userAnswer.order : []}
            submitted={submitted}
            isCorrect={isCorrect}
            onReorder={(order) => setUserAnswer({ type: 'order', order })}
          />
        )}

        {submitted && isCorrect === false && props.tags && props.tags.length > 0 && (
          <ConceptTagsPanel tags={props.tags} />
        )}

        <HintPanel
          problemId={props.id}
          hints={props.hints}
          tags={props.tags}
          submitted={submitted}
        />

        <ProblemSubmitBar
          submitted={submitted}
          canSubmit={submitReady}
          onSubmit={handleSubmit}
          onRetry={handleRetry}
        />

        <SolutionPanel
          problemId={props.id}
          solution={props.solution}
          submitted={submitted}
        />
      </div>
    </div>
  );
}
