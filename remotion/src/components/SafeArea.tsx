// src/components/SafeArea.tsx
//
// Wraps overlay content so it never sits under social-media UI chrome
// (status bars, captions, share buttons etc). Per the brief:
// at least 70px left/right, 140px top, 240px bottom.

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from '../styles/theme';

export const SafeArea: React.FC<{
  children: React.ReactNode;
  align?: 'top' | 'center' | 'bottom';
}> = ({ children, align = 'center' }) => {
  const justifyContent =
    align === 'top' ? 'flex-start' : align === 'bottom' ? 'flex-end' : 'center';

  return (
    <AbsoluteFill
      style={{
        paddingLeft: theme.layout.safeLeft,
        paddingRight: theme.layout.safeRight,
        paddingTop: theme.layout.safeTop,
        paddingBottom: theme.layout.safeBottom,
        display: 'flex',
        flexDirection: 'column',
        justifyContent,
        alignItems: 'flex-start',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
