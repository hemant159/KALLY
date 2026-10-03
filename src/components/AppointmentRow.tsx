import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radii } from '../theme';
import { useThemeColors, useIsDark } from '../theme/useTheme';
import type { Appointment } from '../data/mock';
import { getClient, getService, formatTime, formatINR, statusColor } from '../data/mock';
import StatusChip from './StatusChip';

interface AppointmentRowProps {
  appointment: Appointment;
  onPress?: () => void;
  showDate?: boolean;
}

export default function AppointmentRow({
  appointment,
  onPress,
  showDate = false,
}: AppointmentRowProps) {
  const tc = useThemeColors();
  const isDark = useIsDark();
  const client = getClient(appointment.clientId);
  const service = getService(appointment.serviceId);
  const color = service?.color ?? Colors.blue;

  const startStr = formatTime(appointment.startTime);
  const endStr = formatTime(appointment.endTime);
  const initials = client?.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('') ?? '?';

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: tc.background }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${client?.name}, ${service?.name}, ${startStr} to ${endStr}, ${appointment.status}`}
    >
      {/* Color accent bar */}
      <View style={[styles.colorBar, { backgroundColor: color }]} />

      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: client?.avatarColor ?? color }]}>
        <Text style={styles.initials}>{initials}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            style={[styles.clientName, { color: tc.label }]}
            numberOfLines={1}
          >
            {client?.name ?? 'Unknown'}
          </Text>
          <Text style={[styles.amount, { color: tc.secondaryLabel }]}>
            {formatINR(appointment.totalAmount)}
          </Text>
        </View>

        <Text
          style={[styles.service, { color: tc.secondaryLabel }]}
          numberOfLines={1}
        >
          {service?.name ?? 'Unknown service'}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.timeRow}>
            <Ionicons
              name="time-outline"
              size={12}
              color={tc.tertiaryLabel}
            />
            <Text style={[styles.time, { color: tc.secondaryLabel }]}>
              {startStr} – {endStr}
            </Text>
          </View>
          <StatusChip status={appointment.status} size="sm" />
        </View>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={16} color={tc.tertiaryLabel} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingRight: Spacing.lg,
    gap: Spacing.md,
  },
  colorBar: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginLeft: Spacing.lg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontSize: FontSizes.footnote,
    fontWeight: FontWeights.bold,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientName: {
    fontSize: FontSizes.subheadline,
    fontWeight: FontWeights.semibold,
    flex: 1,
    marginRight: Spacing.sm,
  },
  amount: {
    fontSize: FontSizes.footnote,
    fontWeight: FontWeights.medium,
  },
  service: {
    fontSize: FontSizes.footnote,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  time: {
    fontSize: FontSizes.caption1,
  },
});
