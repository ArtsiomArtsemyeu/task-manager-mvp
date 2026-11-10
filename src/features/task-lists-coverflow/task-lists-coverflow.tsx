'use client';

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type PanInfo,
} from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import styles from './task-lists-coverflow.module.css';
import { CoverflowItem } from './ui/coverflow-item/coverflow-item';

/** Motion Gallery coverflow defaults: turn / spread / depth / centerSpacing */
const TURN = 55;
const SPREAD = 0.3;
const DEPTH = 0.5;
const CENTER_SPACING = 0.8;
const CARD_WIDTH = 300;
const SPRING = { stiffness: 160, damping: 28, mass: 0.9 };

export type TaskListsCoverflowItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TaskListsCoverflowProps = {
  items: TaskListsCoverflowItem[];
};

function clampIndex(value: number, length: number): number {
  if (length <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(length - 1, value));
}

export function TaskListsCoverflow({ items }: TaskListsCoverflowProps) {
  const t = useTranslations();
  const reduceMotion = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const activeIndexRef = useRef(0);
  const didDragRef = useRef(false);
  const scrollX = useMotionValue(0);
  const springX = useSpring(scrollX, SPRING);
  const effectiveScrollX = reduceMotion ? scrollX : springX;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    scrollX.set(activeIndex);
  }, [activeIndex, scrollX]);

  const goTo = useCallback(
    (nextIndex: number) => {
      const clamped = clampIndex(nextIndex, items.length);
      setActiveIndex(clamped);
      scrollX.set(clamped);
    },
    [items.length, scrollX],
  );

  const selectIndex = useCallback(
    (nextIndex: number) => {
      if (didDragRef.current) {
        return;
      }

      goTo(nextIndex);
    },
    [goTo],
  );

  const onDragStart = useCallback(() => {
    didDragRef.current = false;
    setIsDragging(true);
  }, []);

  const onDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (Math.abs(info.offset.x) > 6) {
        didDragRef.current = true;
      }

      const centerGap = CARD_WIDTH * CENTER_SPACING;
      scrollX.set(scrollX.get() - info.delta.x / (centerGap * 0.85));
    },
    [scrollX],
  );

  const onDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      const projected = scrollX.get() - info.velocity.x * 0.002;
      let next = Math.round(projected);

      if (Math.abs(info.velocity.x) > 650) {
        next = activeIndexRef.current - Math.sign(info.velocity.x);
      }

      goTo(next);
    },
    [goTo, scrollX],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(activeIndexRef.current - 1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(activeIndexRef.current + 1);
      }

      if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      }

      if (event.key === 'End') {
        event.preventDefault();
        goTo(items.length - 1);
      }
    },
    [goTo, items.length],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.host} aria-label={t('taskListsCoverflow.label')}>
      <motion.div
        className={styles.stage}
        role="group"
        aria-roledescription="carousel"
        aria-label={t('taskListsCoverflow.label')}
        tabIndex={0}
        onKeyDown={onKeyDown}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className={styles.track} aria-live="polite">
          {items.map((item, index) => (
            <CoverflowItem
              key={item.id}
              index={index}
              scrollX={effectiveScrollX}
              cardWidth={CARD_WIDTH}
              turn={TURN}
              spread={SPREAD}
              depth={DEPTH}
              centerSpacing={CENTER_SPACING}
              reduceMotion={reduceMotion}
              isActive={index === activeIndex}
              onSelect={selectIndex}
            >
              {item.content}
            </CoverflowItem>
          ))}
        </div>
      </motion.div>

      <div
        className={styles.dots}
        role="tablist"
        aria-label={t('taskListsCoverflow.pagination')}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={t('taskListsCoverflow.goToList', { name: item.label })}
            className={styles.dot}
            data-active={index === activeIndex ? 'true' : 'false'}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </section>
  );
}
