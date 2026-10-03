import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../theme/useTheme';
import { FontSizes, FontWeights, Spacing } from '../theme';

export default function PlaceholderScreen({ route }: any) {
  const tc = useThemeColors();
  const name = route?.name ?? 'Screen';
  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: tc.groupedBackground }]}
    >
      <View style={styles.center}>
        <Text style={[styles.label, { color: tc.secondaryLabel }]}>
          {name}
        </Text>
        <Text style={[styles.sub, { color: tc.tertiaryLabel }]}>
          Coming up next — stay tuned!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.title3,
    fontWeight: FontWeights.semibold,
  },
  sub: {
    fontSize: FontSizes.body,
  },
});
