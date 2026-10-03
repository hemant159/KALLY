import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FrostyPill from '../components/FrostyPill';
import { Colors, FontSizes, FontWeights, Spacing, Radii } from '../theme';
import { useThemeColors, useIsDark } from '../theme/useTheme';
import {
  dateKey,
  formatTime,
  type Appointment,
  type Client,
  type Service,
} from '../data/mock';
import { useAppointmentStore } from '../store/useAppointmentStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HOUR_HEIGHT = 60; // px per hour
const TIMELINE_START_HOUR = 0; // 00:00
const TIMELINE_END_HOUR = 24;
const LABEL_WIDTH = 52;

const WEEKDAY_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
];

function getWeekDays(date: Date): Date[] {
  const dow = date.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function timeToFraction(isoDate: string): number {
  const d = new Date(isoDate);
  const h = d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    hour12: false,
  });
  const m = d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    minute: 'numeric',
  });
  return parseInt(h, 10) + parseInt(m, 10) / 60;
}

export default function DayView({ route, navigation }: any) {
  const tc = useThemeColors();
  const isDark = useIsDark();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const passedDate = route?.params?.date
    ? new Date(route.params.date)
    : new Date();

  const [selectedDate, setSelectedDate] = useState<Date>(passedDate);
  const today = useMemo(() => new Date(), []);

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const dkSelected = dateKey(selectedDate);
  const dkToday = dateKey(today);

  const allAppointments = useAppointmentStore(state => state.appointments);
  const clients = useAppointmentStore(state => state.clients);
  const services = useAppointmentStore(state => state.services);

  const appointments = useMemo(() => {
    return allAppointments
      .filter((a) => {
        const d = new Date(a.startTime);
        return dateKey(d) === dkSelected;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [dkSelected, allAppointments]);

  const nowFraction = useMemo(() => {
    const h = today.getHours();
    const m = today.getMinutes();
    return h + m / 60;
  }, [today]);

  const nowY = (nowFraction - TIMELINE_START_HOUR) * HOUR_HEIGHT;
  const nowLabel = today.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Initial scroll offset is handled by contentOffset prop on ScrollView

  const dayTitle = useMemo(() => {
    const dn = DAY_NAMES[selectedDate.getDay()];
    const formatted = selectedDate.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${dn} \u2013 ${formatted}`;
  }, [selectedDate]);

  const monthLabel = selectedDate.toLocaleString('default', { month: 'short' });
  const isToday = dkSelected === dkToday;

  const blurTint = isDark ? 'dark' : 'light';
  const bubbleBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  return (
    <View style={[styles.root, { backgroundColor: tc.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      {/* ── Main Content ── */}
      {/* We don't use a full-screen FlatList here, so we wrap the top part in SafeAreaView and leave scroll padding */}
      <View style={{ flex: 1, paddingTop: insets.top + 70 }}>
        
        {/* ── Week strip ── */}
        <View style={[styles.weekStrip, { borderBottomColor: tc.separator }]}>
          {weekDays.map((d, i) => {
            const k = dateKey(d);
            const isSelected = k === dkSelected;
            const isTd = k === dkToday;
            const showCircle = isSelected || isTd;
            return (
              <TouchableOpacity
                key={k}
                style={styles.weekCol}
                onPress={() => setSelectedDate(d)}
                accessibilityRole="button"
              >
                <Text style={[styles.weekDayLetter, { color: tc.secondaryLabel }]}>
                  {WEEKDAY_SHORT[i]}
                </Text>
                <View
                  style={[
                    styles.weekDateCircle,
                    showCircle && { backgroundColor: Colors.red },
                  ]}
                >
                  <Text
                    style={[
                      styles.weekDateNum,
                      { color: showCircle ? '#FFF' : tc.label },
                    ]}
                  >
                    {d.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Day title ── */}
        <View style={styles.dayTitleRow}>
          <Text style={[styles.dayTitle, { color: tc.label }]}>{dayTitle}</Text>
        </View>

        {/* ── Timeline ── */}
        <ScrollView
          ref={scrollRef}
          style={styles.timelineScroll}
          contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
          showsVerticalScrollIndicator={false}
          contentOffset={{ x: 0, y: Math.max(0, (nowFraction - 2) * HOUR_HEIGHT) }}
        >
          <View
            style={[
              styles.timelineContainer,
              { height: (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * HOUR_HEIGHT },
            ]}
          >
            {Array.from({ length: TIMELINE_END_HOUR - TIMELINE_START_HOUR }, (_, i) => {
              const hour = TIMELINE_START_HOUR + i;
              const label = `${String(hour).padStart(2, '0')}:00`;
              return (
                <View
                  key={hour}
                  style={[styles.hourRow, { top: i * HOUR_HEIGHT }]}
                >
                  <Text style={[styles.hourLabel, { color: tc.secondaryLabel }]}>
                    {label}
                  </Text>
                  <View
                    style={[
                      styles.hourLine,
                      { backgroundColor: tc.separator },
                    ]}
                  />
                </View>
              );
            })}

            {appointments.map((apt) => (
              <AppointmentBlock
                key={apt.id}
                appointment={apt}
                clients={clients}
                services={services}
                tc={tc}
                onPress={() =>
                  navigation?.navigate?.('AppointmentDetail', {
                    appointmentId: apt.id,
                  })
                }
              />
            ))}

            {isToday && (
              <View style={[styles.nowLine, { top: nowY }]}>
                <View style={[styles.nowPill, { backgroundColor: Colors.red }]}>
                  <Text style={styles.nowPillText}>{nowLabel}</Text>
                </View>
                <View
                  style={[styles.nowLineBar, { backgroundColor: Colors.red }]}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* ── Floating Header ── */}
      <View style={[styles.floatingHeader, { top: insets.top || Spacing.md }]}>
        <FrostyPill>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation?.goBack?.()}
          >
            <Ionicons name="chevron-back" size={18} color={tc.label} />
            <Text style={[styles.backLabel, { color: tc.label }]}>
              {monthLabel}
            </Text>
          </TouchableOpacity>
        </FrostyPill>

        <FrostyPill>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="reorder-four-outline" size={20} color={tc.label} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="search-outline" size={20} color={tc.label} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                navigation?.navigate?.('NewAppointment', {
                  date: selectedDate.toISOString(),
                })
              }
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
            onPress={() => {
              setSelectedDate(today);
              const scrollToY = Math.max(0, (nowFraction - 2) * HOUR_HEIGHT);
              scrollRef.current?.scrollTo({ y: scrollToY, animated: true });
            }}
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

// ─── AppointmentBlock ─────────────────────────────────────────────────────────

function AppointmentBlock({
  appointment,
  clients,
  services,
  tc,
  onPress,
}: {
  appointment: Appointment;
  clients: Client[];
  services: Service[];
  tc: any;
  onPress: () => void;
}) {
  const service = services.find((s) => s.id === appointment.serviceId);
  const client = clients.find((c) => c.id === appointment.clientId);
  const color = service?.color ?? Colors.blue;

  const startH = timeToFraction(appointment.startTime);
  const endH = timeToFraction(appointment.endTime);
  const top = (startH - TIMELINE_START_HOUR) * HOUR_HEIGHT;
  const height = Math.max((endH - startH) * HOUR_HEIGHT, 24);

  return (
    <TouchableOpacity
      style={[
        styles.apptBlock,
        {
          top,
          height,
          backgroundColor: color + '22',
          borderLeftColor: color,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.apptTitle, { color }]} numberOfLines={1}>
        {client?.name}
      </Text>
      {height > 36 && (
        <Text style={[styles.apptSub, { color }]} numberOfLines={1}>
          {service?.name}
        </Text>
      )}
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

  // Header Elements
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 44,
    paddingHorizontal: Spacing.md,
  },
  backLabel: {
    fontSize: FontSizes.headline,
    fontWeight: FontWeights.semibold,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  // Week strip
  weekStrip: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  weekCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  weekDayLetter: {
    fontSize: FontSizes.caption1,
    fontWeight: FontWeights.semibold,
  },
  weekDateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDateNum: {
    fontSize: FontSizes.callout,
    fontWeight: FontWeights.medium,
  },

  // Day title
  dayTitleRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  dayTitle: {
    fontSize: FontSizes.headline,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
  },

  // Timeline
  timelineScroll: { flex: 1 },
  timelineContainer: {
    position: 'relative',
    marginHorizontal: Spacing.lg,
  },
  hourRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: HOUR_HEIGHT,
  },
  hourLabel: {
    width: LABEL_WIDTH,
    fontSize: FontSizes.caption1,
    textAlign: 'right',
    paddingRight: Spacing.sm,
    marginTop: -8,
  },
  hourLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    marginTop: 0,
  },

  // Appointment blocks
  apptBlock: {
    position: 'absolute',
    left: LABEL_WIDTH + Spacing.sm,
    right: 0,
    borderLeftWidth: 3,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  apptTitle: {
    fontSize: FontSizes.footnote,
    fontWeight: FontWeights.semibold,
  },
  apptSub: {
    fontSize: FontSizes.caption1,
    opacity: 0.8,
  },

  // Now line
  nowLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  nowPill: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: Radii.sm,
    marginRight: 4,
  },
  nowPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  nowLineBar: {
    flex: 1,
    height: 1.5,
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
