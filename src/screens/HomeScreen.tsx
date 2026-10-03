import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FrostyPill from '../components/FrostyPill';
import { Colors, FontSizes, FontWeights, Spacing, Radii } from '../theme';
import { useThemeColors, useIsDark } from '../theme/useTheme';
import MonthView, { monthSectionHeight } from '../components/MonthView';
import { dateKey } from '../data/mock';
import { getHoliday } from '../data/holidays';

// ... (skipping some logic that I will target specifically next)

const START_YEAR = 2010;
const END_YEAR = 2035;

function buildAllMonths() {
  const result: Array<{ year: number; month: number }> = [];
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    for (let m = 0; m < 12; m++) {
      result.push({ year: y, month: m });
    }
  }
  return result;
}

const ALL_MONTHS = buildAllMonths();

function buildOffsetMap(): Record<string, number> {
  const map: Record<string, number> = {};
  let cumulative = 0;
  for (const { year, month } of ALL_MONTHS) {
    map[`${year}-${month}`] = cumulative;
    cumulative += monthSectionHeight(year, month);
  }
  return map;
}

const OFFSET_MAP = buildOffsetMap();

export default function HomeScreen({ navigation, route }: any) {
  const tc = useThemeColors();
  const isDark = useIsDark();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());

  useEffect(() => {
    if (route.params?.scrollToYear !== undefined && route.params?.scrollToMonth !== undefined) {
      const idx = (route.params.scrollToYear - START_YEAR) * 12 + route.params.scrollToMonth;
      if (idx >= 0 && idx < ALL_MONTHS.length) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ 
            index: idx, 
            animated: false
          });
        }, 50);
      }
      navigation.setParams({ scrollToYear: undefined, scrollToMonth: undefined });
    }
  }, [route.params?.scrollToYear, route.params?.scrollToMonth, navigation, insets.top]);

  const initialScrollIndex = useMemo(() => {
    return (today.getFullYear() - START_YEAR) * 12 + today.getMonth();
  }, [today]);

  const handleSelectDate = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      navigation?.navigate?.('DayView', { date: date.toISOString() });
    },
    [navigation],
  );

  const handleLongPressDate = useCallback(
    (date: Date) => {
      navigation?.navigate?.('NewAppointment', { date: date.toISOString() });
    },
    [navigation],
  );

  const handleTodayPress = useCallback(() => {
    setSelectedDate(today);

    // If we are already looking at the current month, drill down to DayView
    if (displayYear === today.getFullYear() && displayMonth === today.getMonth()) {
      navigation?.navigate?.('DayView', { date: today.toISOString() });
      return;
    }

    const idx = (today.getFullYear() - START_YEAR) * 12 + today.getMonth();
    
    // Jump instantly if far away to avoid glitchy hyperspeed scroll
    const isFar = Math.abs(displayYear - today.getFullYear()) > 1;
    flatListRef.current?.scrollToIndex({ 
      index: idx, 
      animated: !isFar
    });
  }, [today, displayYear, displayMonth, navigation, insets.top]);

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const topItem = viewableItems[0].item;
      setDisplayYear(topItem.year);
      setDisplayMonth(topItem.month);
    }
  }).current;

  const todayKey = dateKey(today);
  const todayHoliday = getHoliday(todayKey);

  const getItemLayout = useCallback((data: any, index: number) => {
    const item = ALL_MONTHS[index];
    return {
      length: monthSectionHeight(item.year, item.month),
      offset: OFFSET_MAP[`${item.year}-${item.month}`],
      index,
    };
  }, []);

  const blurTint = isDark ? 'dark' : 'light';
  const bubbleBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  return (
    <View style={[styles.root, { backgroundColor: tc.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <FlatList
        ref={flatListRef}
        data={ALL_MONTHS}
        keyExtractor={(item) => `${item.year}-${item.month}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 70, // Space for floating header
          paddingBottom: insets.bottom + 90, // Space for floating bottom bar
        }}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={Platform.OS === 'android' ? 7 : 11}
        removeClippedSubviews={true}
        initialScrollIndex={initialScrollIndex}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <MonthView
            year={item.year}
            month={item.month}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onLongPressDate={handleLongPressDate}
          />
        )}
      />

      {/* ── Floating Header ── */}
      <View style={[styles.floatingHeader, { top: insets.top || Spacing.md }]}>
        <FrostyPill>
          <TouchableOpacity
            style={styles.backYearBtn}
            onPress={() => navigation.navigate('YearScreen', { initialYear: displayYear })}
            accessibilityLabel={`Year ${displayYear}. Tap to view year layout.`}
          >
            <Ionicons name="chevron-back" size={18} color={tc.label} />
            <Text style={[styles.yearText, { color: tc.label }]}>{displayYear}</Text>
          </TouchableOpacity>
        </FrostyPill>

        {todayHoliday ? (
          <FrostyPill style={styles.holidayBubble}>
            <Ionicons name="flag" size={12} color={Colors.red} />
            <Text style={[styles.holidayBadgeText, { color: Colors.red }]} numberOfLines={1}>
              {todayHoliday}
            </Text>
          </FrostyPill>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <FrostyPill>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Switch layout">
              <Ionicons name="grid-outline" size={20} color={tc.label} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Search">
              <Ionicons name="search-outline" size={20} color={tc.label} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                navigation?.navigate?.('NewAppointment', {
                  date: selectedDate.toISOString(),
                })
              }
              accessibilityLabel="Add appointment"
            >
              <Ionicons name="add" size={24} color={tc.label} />
            </TouchableOpacity>
          </View>
        </FrostyPill>
      </View>

      {/* ── Floating Bottom Bar ── */}
      <View style={[styles.floatingBottom, { bottom: insets.bottom || Spacing.md }]}>
        <FrostyPill>
          <TouchableOpacity
            style={styles.todayPill}
            onPress={handleTodayPress}
            accessibilityLabel="Go to today"
          >
            <Text style={[styles.todayPillText, { color: tc.label }]}>Today</Text>
          </TouchableOpacity>
        </FrostyPill>

        <FrostyPill>
          <View style={styles.bottomBarRight}>
            <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Notifications">
              <Ionicons name="alert-circle-outline" size={22} color={tc.secondaryLabel} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Inbox">
              <Ionicons name="mail-outline" size={22} color={tc.secondaryLabel} />
            </TouchableOpacity>
          </View>
        </FrostyPill>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  
  // Floating Containers
  floatingHeader: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    zIndex: 10,
  },
  floatingBottom: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },

  // Bubble Shared Style
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    // Add subtle shadow for iOS feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // Header Elements
  backYearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  yearText: {
    fontSize: FontSizes.headline,
    fontWeight: FontWeights.semibold,
  },
  holidayBubble: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: 6,
    justifyContent: 'center',
  },
  holidayBadgeText: {
    fontSize: FontSizes.caption1,
    fontWeight: FontWeights.semibold,
    flexShrink: 1,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  
  // Bottom Bar Elements
  bottomBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  todayPill: {
    paddingHorizontal: Spacing.xl,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayPillText: {
    fontSize: FontSizes.subheadline,
    fontWeight: FontWeights.semibold,
  },
  
  iconBtn: {
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
