import React from 'react';
import { View, Platform, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeColors, useIsDark } from '../theme/useTheme';

interface FrostyPillProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function FrostyPill({ children, style }: FrostyPillProps) {
  const isDark = useIsDark();
  const blurTint = isDark ? 'dark' : 'light';
  const bubbleBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  
  // On Android, real-time blurring over a fast-scrolling list requires the GPU to 
  // recalculate the blur on every single frame, causing severe scrolling lag.
  // We fall back to a sleek semi-transparent solid color to keep it buttery smooth.
  if (Platform.OS === 'android') {
    return (
      <View style={[
        styles.bubble, 
        { 
          borderColor: bubbleBorder, 
          backgroundColor: isDark ? 'rgba(28,28,30,0.92)' : 'rgba(255,255,255,0.92)'
        }, 
        style
      ]}>
        {children}
      </View>
    );
  }

  return (
    <BlurView 
      intensity={80} 
      tint={blurTint} 
      style={[styles.bubble, { borderColor: bubbleBorder }, style]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
