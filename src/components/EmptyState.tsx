import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontSizes, FontWeights, Spacing, Colors } from '../theme';
import { useThemeColors } from '../theme/useTheme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon = 'calendar-outline',
  title,
  subtitle,
  action,
}: EmptyStateProps) {
  const tc = useThemeColors();

  return (
    <View style={styles.container} accessibilityRole="none">
      <View style={[styles.iconCircle, { backgroundColor: tc.fill }]}>
        <Ionicons name={icon} size={36} color={tc.secondaryLabel} />
      </View>
      <Text style={[styles.title, { color: tc.label }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: tc.secondaryLabel }]}>
          {subtitle}
        </Text>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.massive,
    gap: Spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.headline,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.subheadline,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: Spacing.sm,
  },
});
