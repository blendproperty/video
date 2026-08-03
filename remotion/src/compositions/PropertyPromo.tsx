// src/compositions/PropertyPromo.tsx
//
// The full 9-scene promo, driven entirely by props (property + media
// validated against data/schema.ts). Works for any of the three property
// categories (warehouse / commercial / land) because the scenes read
// generic fields (totalArea/totalAreaLabel, stats[], featuresHeadline)
// rather than warehouse-specific ones — the portal's wizard fills in
// sensible defaults per category, and the agent can edit them freely.
// Total duration: 885 frames = 29.5s at 30fps.

import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import type { PropertyInput, MediaInput } from '../data/schema';
import { formatZaCurrency, formatZaNumber } from '../data/property';
import { theme } from '../styles/theme';

import { MediaScene } from '../components/MediaScene';
import { SafeArea } from '../components/SafeArea';
import { LogoReveal } from '../components/LogoReveal';
import { BrandedHeadline } from '../components/BrandedHeadline';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { FeatureBadge } from '../components/FeatureBadge';
import { ContactCard } from '../components/ContactCard';
import { ProgressLine } from '../components/ProgressLine';

export const SCENE_DURATIONS = {
  opening: 60,
  positioning: 105,
  primaryAreaCounter: 90,
  secondaryAreaCounter: 105,
  operationalFeatures: 105,
  builtForBusiness: 105,
  location: 90,
  rentalAvailability: 105,
  finalCta: 120,
} as const;

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((sum, d) => sum + d, 0);

type SceneProps = { property: PropertyInput; media: MediaInput };

const OpeningScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.exteriorA} durationInFrames={SCENE_DURATIONS.opening} panDirection="in">
    <SafeArea align="bottom">
      <LogoReveal delay={2} />
      <div style={{ height: 24 }} />
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 34,
          fontWeight: theme.weights.heading,
          color: theme.colors.textPrimary,
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}
      >
        {property.listingLabel}
      </div>
      <div
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: 44,
          fontWeight: theme.weights.heading,
          color: theme.colors.textPrimary,
        }}
      >
        {property.propertyName}
      </div>
      <div style={{ fontFamily: theme.fonts.body, fontSize: 30, color: theme.colors.textSecondary }}>
        {property.location}
      </div>
    </SafeArea>
  </MediaScene>
);

const PositioningScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.exteriorB} durationInFrames={SCENE_DURATIONS.positioning} panDirection="right">
    <SafeArea align="center">
      <BrandedHeadline text={property.headline} fontSize={64} delay={4} />
    </SafeArea>
  </MediaScene>
);

const PrimaryAreaCounterScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene
    src={media.primaryAreaBackdrop}
    durationInFrames={SCENE_DURATIONS.primaryAreaCounter}
    panDirection="in"
    gradient="both"
  >
    <SafeArea align="center">
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 28,
          fontWeight: theme.weights.heading,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: theme.colors.accent,
          marginBottom: 8,
        }}
      >
        {property.totalAreaLabel}
      </div>
      <AnimatedCounter to={property.totalArea} suffix=" m²" fontSize={140} durationInFrames={40} delay={4} />
    </SafeArea>
  </MediaScene>
);

const SecondaryAreaCounterScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.secondaryAreaBackdrop} durationInFrames={SCENE_DURATIONS.secondaryAreaCounter} panDirection="left">
    <SafeArea align="bottom">
      <AnimatedCounter to={property.secondaryArea} suffix=" m²" fontSize={92} durationInFrames={36} delay={4} />
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 34,
          fontWeight: theme.weights.body,
          color: theme.colors.textSecondary,
        }}
      >
        {property.secondaryAreaLabel}
      </div>
    </SafeArea>
  </MediaScene>
);

const OperationalFeaturesScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.featureShot} durationInFrames={SCENE_DURATIONS.operationalFeatures} panDirection="in">
    <SafeArea align="bottom">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {property.stats.map((stat, i) => (
          <FeatureBadge key={stat.label} label={`${stat.label}: ${stat.value}`} delay={4 + i * 10} />
        ))}
      </div>
    </SafeArea>
  </MediaScene>
);

const BuiltForBusinessScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.infrastructureShot} durationInFrames={SCENE_DURATIONS.builtForBusiness} panDirection="out">
    <SafeArea align="top">
      <BrandedHeadline text={property.featuresHeadline} fontSize={56} delay={2} />
      <div style={{ height: 220 }} />
    </SafeArea>
    <SafeArea align="bottom">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {property.features.slice(0, 3).map((feature, i) => (
          <FeatureBadge key={feature} label={feature} delay={20 + i * 10} />
        ))}
      </div>
    </SafeArea>
  </MediaScene>
);

const LocationScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.groundsWide} durationInFrames={SCENE_DURATIONS.location} panDirection="in">
    <SafeArea align="center">
      <BrandedHeadline
        text={`Strategically located in\n${property.location}`}
        highlight={property.location}
        fontSize={52}
        delay={4}
      />
    </SafeArea>
  </MediaScene>
);

const RentalAvailabilityScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.availabilityBackdrop} durationInFrames={SCENE_DURATIONS.rentalAvailability} panDirection="right" gradient="both">
    <SafeArea align="center">
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 30,
          fontWeight: theme.weights.heading,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: theme.colors.accent,
          marginBottom: 8,
        }}
      >
        {property.availability}
      </div>
      <AnimatedCounter prefix="R " to={property.monthlyRental} fontSize={88} durationInFrames={40} delay={4} />
      <div style={{ fontFamily: theme.fonts.body, fontSize: 28, color: theme.colors.textSecondary }}>
        per month{property.excludingVat ? ', excluding VAT' : ''}
      </div>
      <div style={{ height: 12 }} />
      <div
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: 44,
          fontWeight: theme.weights.heading,
          color: theme.colors.textPrimary,
        }}
      >
        {formatZaCurrency(property.ratePerSquareMetre)}/m²
      </div>
    </SafeArea>
  </MediaScene>
);

const FinalCtaScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.entranceFacade} durationInFrames={SCENE_DURATIONS.finalCta} panDirection="in" gradient="both">
    <SafeArea align="top">
      <LogoReveal delay={2} />
    </SafeArea>
    <SafeArea align="bottom">
      <ContactCard property={property} delay={20} />
    </SafeArea>
  </MediaScene>
);

export const PropertyPromo: React.FC<SceneProps> = ({ property, media }) => {
  let cursor = 0;
  const at = (key: keyof typeof SCENE_DURATIONS) => {
    const from = cursor;
    cursor += SCENE_DURATIONS[key];
    return from;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <Sequence from={at('opening')} durationInFrames={SCENE_DURATIONS.opening} premountFor={15}>
        <OpeningScene property={property} media={media} />
      </Sequence>
      <Sequence from={at('positioning')} durationInFrames={SCENE_DURATIONS.positioning} premountFor={15}>
        <PositioningScene property={property} media={media} />
      </Sequence>
      <Sequence from={at('primaryAreaCounter')} durationInFrames={SCENE_DURATIONS.primaryAreaCounter} premountFor={15}>
        <PrimaryAreaCounterScene property={property} media={media} />
      </Sequence>
      <Sequence from={at('secondaryAreaCounter')} durationInFrames={SCENE_DURATIONS.secondaryAreaCounter} premountFor={15}>
        <SecondaryAreaCounterScene property={property} media={media} />
      </Sequence>
      <Sequence from={at('operationalFeatures')} durationInFrames={SCENE_DURATIONS.operationalFeatures} premountFor={15}>
        <OperationalFeaturesScene property={property} media={media} />
      </Sequence>
      <Sequence from={at('builtForBusiness')} durationInFrames={SCENE_DURATIONS.builtForBusiness} premountFor={15}>
        <BuiltForBusinessScene property={property} media={media} />
      </Sequence>
      <Sequence from={at('location')} durationInFrames={SCENE_DURATIONS.location} premountFor={15}>
        <LocationScene property={property} media={media} />
      </Sequence>
      <Sequence from={at('rentalAvailability')} durationInFrames={SCENE_DURATIONS.rentalAvailability} premountFor={15}>
        <RentalAvailabilityScene property={property} media={media} />
      </Sequence>
      <Sequence from={at('finalCta')} durationInFrames={SCENE_DURATIONS.finalCta} premountFor={15}>
        <FinalCtaScene property={property} media={media} />
      </Sequence>

      <ProgressLine />
    </AbsoluteFill>
  );
};
