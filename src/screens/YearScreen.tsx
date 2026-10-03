import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FrostyPill from '../components/FrostyPill';
import { Colors, FontSizes, FontWeights, Spacing, Radii } from '../theme';
import { useThemeColors, useIsDark } from '../theme/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PAD = Spacing.lg;
const MONTH_GAP = Spacing.md;
const MONTH_W = Math.floor((SCREEN_WIDTH - H_PAD * 2 - MONTH_GAP * 2) / 3);

const START_YEAR = 2010;
const END_YEAR = 2035;
const YEARS = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// --- Precise Height Calculation for getItemLayout ---
const CELL_SIZE = Math.floor(MONTH_W / 7);
const TINY_GRID_GAP = 3;
const TINY_GRID_H = (CELL_SIZE * 6) + (TINY_GRID_GAP * 5);
const TINY_TITLE_H = 22 + Spacing.xs; // Approx line height 22 + margin 4
const TINY_MONTH_H = TINY_TITLE_H + TINY_GRID_H + Spacing.lg; // Added missing marginBottom: 20
const MONTHS_GRID_H = (TINY_MONTH_H * 4) + (MONTH_GAP * 3);
const YEAR_TITLE_H = 34 + Spacing.md; // Approx line height 34 + margin 16
const YEAR_BLOCK_PAD = Spacing.xl + Spacing.xl + StyleSheet.hairlineWidth; // paddingTop + divider marginTop + line
const EXACT_YEAR_H = YEAR_BLOCK_PAD + YEAR_TITLE_H + MONTHS_GRID_H;
// ----------------------------------------------------

export default function YearScreen({ navigation, route }: any) {
  const tc = useThemeColors();
  const isDark = useIsDark();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const initialYear = route?.params?.initialYear ?? new Date().getFullYear();
  const [displayYear, setDisplayYear] = useState(initialYear);
  const today = useMemo(() => new Date(), []);
  
  const initialIdx = YEARS.indexOf(initialYear);

  const handleMonthPress = useCallback(
    (year: number, month: number) => {
      navigation.navigate('Home', {
        scrollToYear: year,
        scrollToMonth: month,
      });
    },
    [navigation]
  );

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setDisplayYear(viewableItems[0].item);
    }
  }).current;

  const blurTint = isDark ? 'dark' : 'light';
  const bubbleBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  return (
    <View style={[styles.root, { backgroundColor: tc.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* ── Year List ── */}
      <FlatList
        ref={flatListRef}
        data={YEARS}
        keyExtractor={(y) => String(y)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, {
          paddingTop: insets.top + 70,
          paddingBottom: insets.bottom + 90,
        }]}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={Platform.OS === 'android' ? 5 : 7}
        initialScrollIndex={initialIdx >= 0 ? initialIdx : undefined}
        getItemLayout={(_, index) => ({
          length: EXACT_YEAR_H, 
          offset: EXACT_YEAR_H * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 100));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
          });
        }}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item: year }) => (
          <YearBlock
            year={year}
            today={today}
            tc={tc}
            onMonthPress={(month) => handleMonthPress(year, month)}
          />
        )}
      />

      {/* ── Floating Header ── */}
      <View style={[styles.floatingHeader, { top: insets.top || Spacing.md }]}>
        <View style={{ flex: 1 }} />
        <FrostyPill>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Search">
              <Ionicons name="search-outline" size={20} color={tc.label} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Add appointment">
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
            onPress={() => {
              if (displayYear === today.getFullYear()) {
                // We are already looking at the current year, drill down to current month
                navigation.navigate('Home', { 
                  scrollToYear: today.getFullYear(), 
                  scrollToMonth: today.getMonth() 
                });
                return;
              }

              const idx = YEARS.indexOf(today.getFullYear());
              if (idx >= 0) {
                const isFar = Math.abs(displayYear - today.getFullYear()) > 2;
                flatListRef.current?.scrollToIndex({ 
                  index: idx, 
                  animated: !isFar
                });
              }
            }}
            accessibilityLabel="Go to today"
          >
            <Text style={[styles.todayPillText, { color: tc.label }]}>Today</Text>
          </TouchableOpacity>
        </FrostyPill>

        <FrostyPill>
          <View style={styles.bottomBarRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="alert-circle-outline" size={22} color={tc.secondaryLabel} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="mail-outline" size={22} color={tc.secondaryLabel} />
            </TouchableOpacity>
          </View>
        </FrostyPill>
      </View>
    </View>
  );
}

// ─── YearBlock ───────────────────────────────────────────────────────────────

const YearBlock = React.memo(function YearBlock({
  year,
  today,
  tc,
  onMonthPress,
}: {
  year: number;
  today: Date;
  tc: any;
  onMonthPress: (month: number) => void;
}) {
  const isCurrentYear = year === today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  return (
    <View style={styles.yearBlock}>
      <Text style={[styles.yearTitle, { color: isCurrentYear ? Colors.red : tc.label }]}>
        {year}
      </Text>
      
      <View style={styles.monthsGrid}>
        {MONTH_NAMES.map((monthName, mIndex) => (
          <TinyMonth
            key={mIndex}
            year={year}
            month={mIndex}
            monthName={monthName}
            tc={tc}
            isCurrentMonth={isCurrentYear && currentMonth === mIndex}
            currentDate={isCurrentYear && currentMonth === mIndex ? currentDate : null}
            onPress={() => onMonthPress(mIndex)}
          />
        ))}
      </View>
      <View style={[styles.yearDivider, { backgroundColor: tc.separator }]} />
    </View>
  );
});

// ─── TinyMonth ───────────────────────────────────────────────────────────────

function TinyMonth({
  year,
  month,
  monthName,
  tc,
  isCurrentMonth,
  currentDate,
  onPress,
}: {
  year: number;
  month: number;
  monthName: string;
  tc: any;
  isCurrentMonth: boolean;
  currentDate: number | null;
  onPress: () => void;
}) {
  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    
    while (cells.length < 42) {
      cells.push(null);
    }
    return cells;
  }, [year, month]);

  const rows = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

  return (
    <TouchableOpacity
      style={styles.tinyMonthContainer}
      onPress={onPress}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={`${monthName} ${year}`}
    >
      <Text style={[styles.tinyMonthName, { color: isCurrentMonth ? Colors.red : tc.label }]}>
        {monthName}
      </Text>
      <View style={styles.tinyGrid}>
        {rows.map((row, rIndex) => (
          <View key={rIndex} style={styles.tinyRow}>
            {row.map((dayNum, cIndex) => {
              if (!dayNum) return <View key={cIndex} style={styles.tinyCell} />;
              
              const isToday = dayNum === currentDate;
              
              return (
                <View
                  key={cIndex}
                  style={[
                    styles.tinyCell,
                    isToday && { backgroundColor: Colors.red }
                  ]}
                >
                  <Text
                    style={[
                      styles.tinyDayText,
                      { color: isToday ? '#FFF' : tc.label }
                    ]}
                  >
                    {dayNum}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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

  // Year List
  scrollContent: {
    paddingHorizontal: H_PAD,
  },
  yearBlock: {
    paddingTop: Spacing.xl,
  },
  yearTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  yearDivider: {
    height: StyleSheet.hairlineWidth,
    marginTop: Spacing.xl,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MONTH_GAP,
    justifyContent: 'space-between',
  },
  
  // Tiny Month
  tinyMonthContainer: {
    width: MONTH_W,
    marginBottom: Spacing.lg,
  },
  tinyMonthName: {
    fontSize: FontSizes.headline,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  tinyGrid: {
    flexDirection: 'column',
    gap: 3,
  },
  tinyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tinyCell: {
    width: Math.floor(MONTH_W / 7),
    height: Math.floor(MONTH_W / 7),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Math.floor(MONTH_W / 7) / 2,
  },
  tinyDayText: {
    fontSize: 9, 
    fontWeight: FontWeights.medium,
  },
});
