import { Platform } from 'react-native';

// ─── Color Tokens ─────────────────────────────────────────────────────────────
export const Colors = {
  // Accent
  red: '#FF3B30',
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  gray: '#8E8E93',
  purple: '#AF52DE',
  teal: '#5AC8FA',
  yellow: '#FFCC00',

  // Backgrounds
  light: {
    background: '#FFFFFF',
    secondaryBackground: '#F2F2F7',
    tertiaryBackground: '#FFFFFF',
    groupedBackground: '#F2F2F7',
    separator: '#E5E5EA',
    opaqueSeparator: '#C6C6C8',
    label: '#000000',
    secondaryLabel: '#3C3C43CC',
    tertiaryLabel: '#3C3C4399',
    quaternaryLabel: '#3C3C4366',
    placeholderText: '#3C3C432E',
    fill: '#78788029',
    secondaryFill: '#78788052',
    systemGray6: '#F2F2F7',
    systemGray5: '#E5E5EA',
    systemGray4: '#D1D1D6',
    systemGray3: '#C7C7CC',
    systemGray2: '#AEAEB2',
  },
  dark: {
    background: '#000000',
    secondaryBackground: '#1C1C1E',
    tertiaryBackground: '#2C2C2E',
    groupedBackground: '#1C1C1E',
    separator: '#38383A',
    opaqueSeparator: '#545458',
    label: '#FFFFFF',
    secondaryLabel: '#EBEBF599',
    tertiaryLabel: '#EBEBF566',
    quaternaryLabel: '#EBEBF52E',
    placeholderText: '#EBEBF52E',
    fill: '#7878805C',
    secondaryFill: '#78788052',
    systemGray6: '#1C1C1E',
    systemGray5: '#2C2C2E',
    systemGray4: '#3A3A3C',
    systemGray3: '#48484A',
    systemGray2: '#636366',
  },
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const FontSizes = {
  largeTitle: 34,
  title1: 28,
  title2: 22,
  title3: 20,
  headline: 17,
  body: 17,
  callout: 16,
  subheadline: 15,
  footnote: 13,
  caption1: 12,
  caption2: 11,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const FontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

// ─── Radii ────────────────────────────────────────────────────────────────────
export const Radii = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  full: 999,
};

// ─── Status colors ────────────────────────────────────────────────────────────
export const StatusColors = {
  confirmed: '#34C759',
  pending: '#FF9500',
  completed: '#007AFF',
  noShow: '#FF3B30',
  cancelled: '#8E8E93',
};

// ─── Service palette ──────────────────────────────────────────────────────────
export const ServiceColors = [
  '#007AFF', // blue
  '#34C759', // green
  '#FF9500', // orange
  '#FF3B30', // red
  '#AF52DE', // purple
  '#5AC8FA', // teal
  '#FFCC00', // yellow
  '#FF2D55', // pink
];

// ─── Animation durations ──────────────────────────────────────────────────────
export const Durations = {
  fast: 180,
  normal: 250,
  slow: 350,
};
