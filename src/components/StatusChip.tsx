import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AccessibilityProps,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, Radii, StatusColors } from '../theme';
import { useThemeColors } from '../theme/useTheme';
import type { AppointmentStatus } from '../data/mock';

interface StatusChipProps extends AccessibilityProps {
  status: AppointmentStatus;
  size?: 'sm' | 'md';
  onPress?: () => void;
}

const LABELS: Record<AppointmentStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  completed: 'Completed',
  'no-show': 'No-show',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  confirmed: StatusColors.confirmed,
  pending: StatusColors.pending,
  completed: StatusColors.completed,
  'no-show': StatusColors.noShow,
  cancelled: StatusColors.cancelled,
};

export default function StatusChip({
  status,
  size = 'md',
  onPress,
  ...accessibilityProps
}: StatusChipProps) {
  const tc = useThemeColors();
  const color = STATUS_COLORS[status];
  const label = LABELS[status];

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      style={[
        styles.chip,
        size === 'sm' && styles.chipSm,
        { backgroundColor: color + '20', borderColor: color + '40' },
      ]}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`Status: ${label}`}
      {...accessibilityProps}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text
        style={[
          styles.label,
          size === 'sm' && styles.labelSm,
          { color },
        ]}
      >
        {label}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radii.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  chipSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: FontSizes.footnote,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.1,
  },
  labelSm: {
    fontSize: FontSizes.caption1,
  },
});
