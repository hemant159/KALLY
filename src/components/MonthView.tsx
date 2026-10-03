import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing } from '../theme';
import { useThemeColors, useIsDark } from '../theme/useTheme';
import { dateKey } from '../data/mock';
import { getHoliday } from '../data/holidays';
import { useAppointmentStore } from '../store/useAppointmentStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const MONTH_H_PAD = Spacing.lg; // exported so HomeScreen can use
export const CELL_W = Math.floor((SCREEN_WIDTH - MONTH_H_PAD * 2) / 7);
export const CELL_H = CELL_W + 20; // height including event bars space
export const MONTH_TITLE_H = 50;   // "October" title
export const WEEKDAY_ROW_H = 28;   // M T W T F S S row
export const MONTH_BOTTOM_PAD = 16;

/** Calculate number of grid rows (weeks) for a given month */
export function weeksInMonth(year: number, month: number): number {
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Mon=0, Sun=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Math.ceil((startWeekday + daysInMonth) / 7);
}

/** Approximate pixel height of a month section */
export function monthSectionHeight(year: number, month: number): number {
  return MONTH_TITLE_H + WEEKDAY_ROW_H + weeksInMonth(year, month) * CELL_H + MONTH_BOTTOM_PAD;
}

// Monday-first weekdays
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

interface EventBar { color: string }

interface DayInfo {
  date: Date | null;
  key: string;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  isSunday: boolean;
  isMonthStart: boolean;
  monthLabel?: string;
  events: EventBar[];
  holiday?: string;
}

interface MonthViewProps {
  year: number;
  month: number; // 0-indexed
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onLongPressDate?: (date: Date) => void;
}

const MonthViewComponent = function MonthView({
  year,
  month,
  selectedDate,
  onSelectDate,
  onLongPressDate,
}: MonthViewProps) {
  const tc = useThemeColors();
  const isDark = useIsDark();

  const today = useMemo(() => new Date(), []);
  const todayKey = dateKey(today);
  const selectedKey = selectedDate ? dateKey(selectedDate) : null;

  const appointments = useAppointmentStore((state) => state.appointments);
  const services = useAppointmentStore((state) => state.services);

  // appointment color map
  const eventMap = useMemo(() => {
    const map: Record<string, EventBar[]> = {};
    for (const apt of appointments) {
      const k = new Date(apt.startTime).toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kolkata',
      });
      const svc = services.find(s => s.id === apt.serviceId);
      const color = svc?.color ?? Colors.blue;
      if (!map[k]) map[k] = [];
      if (map[k].length < 3) map[k].push({ color });
    }
    return map;
  }, [appointments, services]);

  const days = useMemo<DayInfo[]>(() => {
    const firstDay = new Date(year, month, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: DayInfo[] = [];

    // Leading blank padding
    for (let i = 0; i < startWeekday; i++) {
      result.push({
        date: null, key: `pad-s-${i}`, isToday: false, isSelected: false,
        isCurrentMonth: false, isSunday: false, isMonthStart: false, events: [],
      });
    }

    // Days of this month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const k = dateKey(date);
      result.push({
        date,
        key: k,
        isToday: k === todayKey,
        isSelected: k === selectedKey,
        isCurrentMonth: true,
        isSunday: date.getDay() === 0,
        isMonthStart: false,
        events: eventMap[k] ?? [],
        holiday: getHoliday(k),
      });
    }

    // Trailing days from next month
    const trailing = (7 - (result.length % 7)) % 7;
    for (let d = 1; d <= trailing; d++) {
      const date = new Date(year, month + 1, d);
      const k = dateKey(date);
      result.push({
        date,
        key: `next-${k}`,
        isToday: k === todayKey,
        isSelected: k === selectedKey,
        isCurrentMonth: false,
        isSunday: date.getDay() === 0,
        isMonthStart: d === 1,
        monthLabel: d === 1 ? MONTH_SHORT[date.getMonth()] : undefined,
        events: eventMap[k] ?? [],
        holiday: getHoliday(k),
      });
    }

    return result;
  }, [year, month, todayKey, selectedKey, eventMap]);

  const handlePress = useCallback(
    (day: DayInfo) => { if (day.date) onSelectDate(day.date); },
    [onSelectDate],
  );
  const handleLong = useCallback(
    (day: DayInfo) => { if (day.date && onLongPressDate) onLongPressDate(day.date); },
    [onLongPressDate],
  );

  const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });

  return (
    <View style={[styles.container, { backgroundColor: tc.background }]}>
      {/* Month title */}
      <Text style={[styles.monthTitle, { color: tc.label }]}>{monthName}</Text>

      {/* Weekday header M T W T F S S */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((d, i) => (
          <View key={`wd-${i}`} style={styles.weekdayCell}>
            <Text style={[styles.weekdayLabel, { color: tc.secondaryLabel }]}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.grid}>
        {days.map((day) => (
          <DayCell
            key={day.key}
            day={day}
            isDark={isDark}
            tc={tc}
            onPress={() => handlePress(day)}
            onLongPress={() => handleLong(day)}
          />
        ))}
      </View>
    </View>
  );
}

// ─── DayCell ──────────────────────────────────────────────────────────────────

interface DayCellProps {
  day: DayInfo;
  isDark: boolean;
  tc: any;
  onPress: () => void;
  onLongPress: () => void;
}

const DayCell = React.memo(function DayCell({
  day, isDark, tc, onPress, onLongPress,
}: DayCellProps) {
  if (!day.date) return <View style={styles.dayCell} />;

  const dayNum = day.date.getDate();
  const isHolidayDay = !!day.holiday;

  // Circle + number color logic
  const showRedCircle = day.isToday || day.isSelected;
  const circleBg = showRedCircle ? Colors.red : 'transparent';

  let numberColor: string;
  if (showRedCircle) {
    numberColor = '#FFFFFF';
  } else if (!day.isCurrentMonth) {
    numberColor = tc.quaternaryLabel ?? '#3C3C4344';
  } else if (isHolidayDay) {
    numberColor = Colors.red; // holidays in red like Indian calendars
  } else if (day.isSunday) {
    numberColor = Colors.red + 'CC'; // Sundays slightly red
  } else {
    numberColor = tc.label;
  }

  const accessLabel = [
    day.date.toLocaleDateString('en-IN', {
      weekday: 'long', month: 'long', day: 'numeric',
    }),
    day.events.length > 0
      ? `${day.events.length} appointment${day.events.length > 1 ? 's' : ''}`
      : '',
    day.holiday ?? '',
    day.isToday ? 'today' : '',
  ].filter(Boolean).join(', ');

  return (
    <TouchableOpacity
      style={styles.dayCell}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.65}
      delayLongPress={350}
      accessibilityRole="button"
      accessibilityLabel={accessLabel}
    >
      {/* Next-month label (e.g. "Nov") */}
      {day.monthLabel ? (
        <Text style={[styles.monthLabelTiny, { color: tc.secondaryLabel }]}>
          {day.monthLabel}
        </Text>
      ) : (
        <View style={styles.monthLabelSpacer} />
      )}

      {/* Date circle */}
      <View style={[styles.dateCircle, showRedCircle && { backgroundColor: circleBg }]}>
        <Text style={[styles.dateNumber, { color: numberColor }]}>{dayNum}</Text>
      </View>

      {/* Event bars */}
      <View style={styles.barsCol}>
        {day.events.slice(0, 3).map((ev, i) => (
          <View key={i} style={[styles.eventBar, { backgroundColor: ev.color }]} />
        ))}
        {/* Holiday marker dot (if holiday but no event bars space) */}
        {isHolidayDay && day.events.length === 0 && (
          <View style={[styles.holidayDot, { backgroundColor: Colors.red + '80' }]} />
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: MONTH_H_PAD,
    paddingBottom: MONTH_BOTTOM_PAD,
  },
  monthTitle: {
    fontSize: FontSizes.title1,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    height: MONTH_TITLE_H - Spacing.md - Spacing.xs,
    lineHeight: MONTH_TITLE_H - Spacing.md - Spacing.xs,
  },
  weekdayRow: {
    flexDirection: 'row',
    height: WEEKDAY_ROW_H,
    alignItems: 'center',
  },
  weekdayCell: {
    width: CELL_W,
    alignItems: 'center',
  },
  weekdayLabel: {
    fontSize: FontSizes.caption1,
    fontWeight: FontWeights.semibold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: CELL_W,
    height: CELL_H,
    alignItems: 'center',
    paddingTop: 2,
  },
  monthLabelTiny: {
    fontSize: 9,
    fontWeight: FontWeights.bold,
    height: 12,
    lineHeight: 12,
  },
  monthLabelSpacer: {
    height: 12,
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumber: {
    fontSize: FontSizes.callout,
    fontWeight: FontWeights.regular,
    lineHeight: 20,
  },
  barsCol: {
    flexDirection: 'column',
    gap: 2,
    marginTop: 2,
    alignItems: 'center',
    width: '80%',
  },
  eventBar: {
    width: '100%',
    height: 3,
    borderRadius: 2,
  },
  holidayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default React.memo(MonthViewComponent, (prev, next) => {
  if (prev.year !== next.year || prev.month !== next.month) return false;
  
  const prevSel = prev.selectedDate;
  const nextSel = next.selectedDate;
  
  // If the previously selected date was in this month, or the newly selected date is in this month, we MUST re-render.
  const wasInMonth = prevSel && prevSel.getFullYear() === prev.year && prevSel.getMonth() === prev.month;
  const isInMonth = nextSel && nextSel.getFullYear() === next.year && nextSel.getMonth() === next.month;
  
  if (wasInMonth || isInMonth) return false; // Re-render!
  
  return true; // Skip re-render!
});
