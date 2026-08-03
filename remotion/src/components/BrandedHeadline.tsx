// src/components/BrandedHeadline.tsx
//
// Line-by-line headline reveal with a masked vertical wipe, plus optional
// highlighted phrase in the accent colour. Supports multi-line text
// (separate lines with \n in the source string).

import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../styles/theme';

const Line: React.FC<{
  text: string;
  frame: number;
  delay: number;
  fontSize: number;
  highlight?: string;
}> = ({ text, frame, delay, fontSize, highlight }) => {
  const localFrame = frame - delay;
  const progress = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const translateY = interpolate(progress, [0, 1], [28, 0]);
  const opacity = progress;

  if (!highlight || !text.includes(highlight)) {
    return (
      <div style={{ overflow: 'hidden', lineHeight: 1.15 }}>
        <div
          style={{
            transform: `translateY(${translateY}px)`,
            opacity,
            fontFamily: theme.fonts.heading,
            fontSize,
            fontWeight: theme.weights.heading,
            color: theme.colors.textPrimary,
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  const index = text.indexOf(highlight);
  const before = text.slice(0, index);
  const after = text.slice(index + highlight.length);

  return (
    <div style={{ overflow: 'hidden', lineHeight: 1.15 }}>
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          fontFamily: theme.fonts.heading,
          fontSize,
          fontWeight: theme.weights.heading,
          color: theme.colors.textPrimary,
        }}
      >
        {before}
        <span style={{ color: theme.colors.accent }}>{highlight}</span>
        {after}
      </div>
    </div>
  );
};

export const BrandedHeadline: React.FC<{
  text: string;
  fontSize?: number;
  highlight?: string;
  delay?: number;
}> = ({ text, fontSize = 64, highlight, delay = 0 }) => {
  const frame = useCurrentFrame();
  const lines = text.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lines.map((line, i) => (
        <Line
          key={line}
          text={line}
          frame={frame}
          delay={delay + i * 6}
          fontSize={fontSize}
          highlight={highlight}
        />
      ))}
    </div>
  );
};
