// src/compositions/PropertyPromo.tsx
//
// The full 9-scene promo, now a props-driven component (property + media
// validated against data/schema.ts) instead of importing static data. This
// is what lets a portal render any listing without touching source code.
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
  glaCounter: 90,
  mainSpace: 105,
  operationalFeatures: 105,
  buildingInfra: 105,
  location: 90,
  rentalAvailability: 105,
  finalCta: 120,
} as const;

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((sum, d) => sum + d, 0);

type SceneProps = { property: PropertyInput; media: MediaInput };

const OpeningScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.exteriorCornerA} durationInFrames={SCENE_DURATIONS.opening} panDirection="in">
    <SafeArea align="bottom">
      <LogoReveal delay={2} />
      <div style={{ height: 24 }} />
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 34,
          fontWeight: 700,
          color: theme.colors.textPrimary,
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}
      >
        To Let
      </div>
      <div
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: 44,
          fontWeight: 700,
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
  <MediaScene src={media.exteriorCornerB} durationInFrames={SCENE_DURATIONS.positioning} panDirection="right">
    <SafeArea align="center">
      <BrandedHeadline text={property.headline} highlight="offices" fontSize={64} delay={4} />
    </SafeArea>
  </MediaScene>
);

const GlaCounterScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.warehouseInteriorB} durationInFrames={SCENE_DURATIONS.glaCounter} panDirection="in" gradient="both">
    <SafeArea align="center">
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: theme.colors.accent,
          marginBottom: 8,
        }}
      >
        Total GLA
      </div>
      <AnimatedCounter to={property.totalGla} suffix=" m²" fontSize={140} durationInFrames={40} delay={4} />
    </SafeArea>
  </MediaScene>
);

const MainSpaceScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.warehouseInteriorA} durationInFrames={SCENE_DURATIONS.mainSpace} panDirection="left">
    <SafeArea align="bottom">
      <AnimatedCounter to={property.warehouseArea} suffix=" m²" fontSize={92} durationInFrames={36} delay={4} />
      <div style={{ fontFamily: theme.fonts.body, fontSize: 34, fontWeight: 600, color: theme.colors.textSecondary }}>
        of clear-span warehouse space
      </div>
    </SafeArea>
  </MediaScene>
);

const OperationalFeaturesScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.loadingCanopy} durationInFrames={SCENE_DURATIONS.operationalFeatures} panDirection="in">
    <SafeArea align="bottom">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FeatureBadge label={`${property.stats.heightToEavesMetres}m to the eaves`} delay={4} />
        <FeatureBadge
          label={`${formatZaNumber(property.stats.loadBearingKgPerSqm)} kg/m² load bearing`}
          delay={14}
        />
        <FeatureBadge label={`${property.stats.powerMva} MVA power supply`} delay={24} />
      </div>
    </SafeArea>
  </MediaScene>
);

const BuildingInfraScene: React.FC<SceneProps> = ({ media }) => (
  <MediaScene src={media.carportsGenerator} durationInFrames={SCENE_DURATIONS.buildingInfra} panDirection="out">
    <SafeArea align="top">
      <BrandedHeadline text="Built for business" fontSize={56} delay={2} />
      <div style={{ height: 220 }} />
    </SafeArea>
    <SafeArea align="bottom">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FeatureBadge label="Backup Power" delay={20} />
        <FeatureBadge label="Backup Water" delay={30} />
        <FeatureBadge label="24-hour Security" delay={40} />
      </div>
    </SafeArea>
  </MediaScene>
);

const LocationScene: React.FC<SceneProps> = ({ property, media }) => (
  <MediaScene src={media.pondWide} durationInFrames={SCENE_DURATIONS.location} panDirection="in">
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
  <MediaScene src={media.dockCorridor} durationInFrames={SCENE_DURATIONS.rentalAvailability} panDirection="right" gradient="both">
    <SafeArea align="center">
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 30,
          fontWeight: 700,
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
      <div style={{ fontFamily: theme.fonts.heading, fontSize: 44, fontWeight: 700, color: theme.colors.textPrimary }}>
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
      <Sequence from={at('glaCounter')} durationInFrames={SCENE_DURATIONS.glaCounter} premountFor={15}>
        <GlaCounterScene property={property} media={media} />
      </Sequence>
      <Sequence from={at('mainSpace')} durationInFrames={SCENE_DURATIONS.mainSpace} premountFor={15}>
        <MainSpaceScene property={property} media={media} />
      </Sequence>
      <Sequence from={at('operationalFeatures')} durationInFrames={SCENE_DURATIONS.operationalFeatures} premountFor={15}>
        <OperationalFeaturesScene property={property} media={media} />
      </Sequence>
      <Sequence from={at('buildingInfra')} durationInFrames={SCENE_DURATIONS.buildingInfra} premountFor={15}>
        <BuildingInfraScene property={property} media={media} />
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
