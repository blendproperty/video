// src/components/ContactCard.tsx
//
// Final call-to-action panel: contact name, phone, listing URL, CTA label.
// Takes `property` as a prop (rather than importing the static default)
// so a different listing's contact details render correctly.

import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import type { PropertyInput } from '../data/schema';
import { theme } from '../styles/theme';

export const ContactCard: React.FC<{ property: PropertyInput; delay?: number }> = ({
  property,
  delay = 0,
}) => {
  const frame = useCurrentFrame() - delay;

  const progress = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const translateY = interpolate(progress, [0, 1], [24, 0]);

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${translateY}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        padding: '32px 36px',
        borderRadius: 20,
        backgroundColor: theme.colors.panelOverlay,
        backdropFilter: 'blur(8px)',
        border: `1px solid rgba(255,255,255,0.12)`,
        maxWidth: 860,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: 40,
          fontWeight: 800,
          color: theme.colors.accent,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        {property.callToAction}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 32,
            fontWeight: 700,
            color: theme.colors.textPrimary,
          }}
        >
          {property.contact.name}
        </span>
        <span
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 28,
            color: theme.colors.textSecondary,
          }}
        >
          {property.contact.phone}
        </span>
      </div>

      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 26,
          color: theme.colors.textMuted,
          wordBreak: 'break-all',
        }}
      >
        {property.listingUrl}
      </div>
    </div>
  );
};
