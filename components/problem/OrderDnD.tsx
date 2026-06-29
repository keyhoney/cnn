'use client';

import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { ProblemQuestion } from '@/components/problem/ProblemQuestion';
import { MathText } from '@/components/math/MathText';
import { cn } from '@/lib/utils';

export interface OrderItem {
  id: string;
  text: string;
  originalIndex: number;
}

interface SortableOrderItemProps {
  item: OrderItem;
  position: number;
  submitted: boolean;
  isCorrectPosition: boolean;
  isWrongPosition: boolean;
  disabled: boolean;
}

function SortableOrderItem({
  item,
  position,
  submitted,
  isCorrectPosition,
  isWrongPosition,
  disabled,
}: SortableOrderItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 rounded-xl border bg-app-surface p-3 transition-shadow',
        isDragging && 'z-10 shadow-lg ring-2 ring-app-accent/30',
        !submitted && 'border-app-border',
        submitted && isCorrectPosition && 'border-status-success bg-status-success-soft',
        submitted && isWrongPosition && 'border-status-error bg-status-error-soft',
        disabled && !isDragging && 'cursor-default'
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold',
          submitted && isCorrectPosition
            ? 'bg-status-success-soft0 text-white'
            : submitted && isWrongPosition
              ? 'bg-status-error text-white'
              : 'bg-app-accent-soft text-app-accent'
        )}
      >
        {position + 1}
      </span>

      <span className="min-w-0 flex-1 text-sm text-app-text">
        <MathText text={item.text} />
      </span>

      {!disabled && (
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 touch-none items-center justify-center rounded-lg text-app-text-muted hover:bg-app-surface-muted hover:text-app-text"
          aria-label={`${position + 1}번 항목 드래그`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
      )}
    </li>
  );
}

interface OrderDnDProps {
  question: string;
  items: OrderItem[];
  order: number[];
  submitted: boolean;
  isCorrect: boolean | null;
  onReorder: (order: number[]) => void;
}

export function OrderDnD({
  question,
  items,
  order,
  submitted,
  isCorrect,
  onReorder,
}: OrderDnDProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const itemMap = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

  const sortedIds = useMemo(() => {
    return order
      .map((origIdx) => items.find((it) => it.originalIndex === origIdx)?.id)
      .filter((id): id is string => Boolean(id));
  }, [order, items]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || submitted) return;

    const oldIndex = sortedIds.indexOf(String(active.id));
    const newIndex = sortedIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const newSortedIds = arrayMove(sortedIds, oldIndex, newIndex);
    const newOrder = newSortedIds.map((id) => itemMap.get(id)?.originalIndex ?? 0);
    onReorder(newOrder);
  };

  return (
    <>
      <ProblemQuestion question={question} />
      <p className="mb-4 text-xs text-app-text-muted">
        항목을 드래그하여 올바른 순서로 배열하세요.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2" data-no-flip>
            {sortedIds.map((id, position) => {
              const item = itemMap.get(id);
              if (!item) return null;

              const isCorrectPosition = submitted && item.originalIndex === position;
              const isWrongPosition = submitted && isCorrect === false && item.originalIndex !== position;

              return (
                <SortableOrderItem
                  key={id}
                  item={item}
                  position={position}
                  submitted={submitted}
                  isCorrectPosition={isCorrectPosition}
                  isWrongPosition={isWrongPosition}
                  disabled={submitted}
                />
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  );
}

/** 정답 순서대로 항목 생성 (SSR·hydration용 — 결정적) */
export function createOrderItems(items: string[]): OrderItem[] {
  return items.map((text, originalIndex) => ({
    id: `order-${originalIndex}`,
    text,
    originalIndex,
  }));
}

/** Fisher–Yates 셔플. items 배열의 정답 순서(0..n-1)를 섞어 표시용 항목 생성 */
export function createShuffledOrderItems(items: string[]): OrderItem[] {
  const indexed = createOrderItems(items);

  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }

  return indexed;
}

export function orderFromShuffledItems(shuffled: OrderItem[]): number[] {
  return shuffled.map((item) => item.originalIndex);
}
