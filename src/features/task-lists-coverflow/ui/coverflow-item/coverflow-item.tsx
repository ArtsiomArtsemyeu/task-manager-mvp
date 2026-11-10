'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import type { ReactNode } from 'react';
import styles from './coverflow-item.module.css';

type CoverflowItemProps = {
  index: number;
  scrollX: MotionValue<number>;
  cardWidth: number;
  turn: number;
  spread: number;
  depth: number;
  centerSpacing: number;
  reduceMotion: boolean;
  isActive: boolean;
  onSelect: (index: number) => void;
  children: ReactNode;
};

export function CoverflowItem({
  index,
  scrollX,
  cardWidth,
  turn,
  spread,
  depth,
  centerSpacing,
  reduceMotion,
  isActive,
  onSelect,
  children,
}: CoverflowItemProps) {
  const centerGap = cardWidth * centerSpacing;
  const stackGap = cardWidth * spread;
  const depthPx = cardWidth * depth;

  const x = useTransform(scrollX, (value) => {
    const offset = index - value;
    const abs = Math.abs(offset);
    const sign = offset < 0 ? -1 : 1;

    if (abs < 1) {
      return offset * centerGap;
    }

    return sign * (centerGap + (abs - 1) * stackGap);
  });

  const rotateY = useTransform(scrollX, (value) => {
    if (reduceMotion) {
      return 0;
    }

    const offset = index - value;
    const abs = Math.abs(offset);

    if (abs < 0.5) {
      return -offset * turn * 2;
    }

    return offset < 0 ? turn : -turn;
  });

  const z = useTransform(scrollX, (value) => {
    if (reduceMotion) {
      return 0;
    }

    const abs = Math.abs(index - value);
    return -Math.min(abs, 3) * depthPx;
  });

  const scale = useTransform(scrollX, (value) => {
    const abs = Math.abs(index - value);
    return 1 - Math.min(abs, 3) * 0.06;
  });

  const opacity = useTransform(scrollX, (value) => {
    const abs = Math.abs(index - value);
    return Math.max(0.35, 1 - Math.min(abs, 3) * 0.18);
  });

  const zIndex = useTransform(scrollX, (value) => {
    return Math.round(1000 - Math.abs(index - value) * 10);
  });

  return (
    <motion.div
      className={styles.item}
      style={{
        width: cardWidth,
        x,
        z,
        rotateY,
        scale,
        opacity,
        zIndex,
      }}
      onClick={() => {
        if (!isActive) {
          onSelect(index);
        }
      }}
    >
      <div className={styles.face} data-active={isActive ? 'true' : 'false'}>
        {children}
      </div>
    </motion.div>
  );
}
