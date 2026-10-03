import { StatusColors, ServiceColors } from '../theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'no-show'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'advance' | 'paid';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'link';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  totalSpent: number; // in paise
  notes?: string;
  avatarColor: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // minutes
  price: number; // in paise
  color: string;
  bufferTime?: number; // minutes
}

export interface StaffMember {
  id: string;
  name: string;
  color: string;
  services: string[]; // service IDs
  workingHours: { start: string; end: string }; // "09:00"
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  staffId: string;
  startTime: string; // ISO UTC
  endTime: string; // ISO UTC
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  totalAmount: number; // paise
  advanceAmount: number; // paise
  notes?: string;
  repeatRule?: 'none' | 'weekly' | 'monthly';
  reminderOffset?: number; // minutes before
}

// ─── Mock Clients ─────────────────────────────────────────────────────────────

export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya@example.com',
    totalVisits: 12,
    totalSpent: 1440000,
    avatarColor: '#007AFF',
    notes: 'Prefers morning slots, sensitive scalp',
  },
  {
    id: 'c2',
    name: 'Rahul Mehta',
    phone: '+91 91234 56789',
    email: 'rahul@example.com',
    totalVisits: 5,
    totalSpent: 360000,
    avatarColor: '#34C759',
  },
  {
    id: 'c3',
    name: 'Ananya Kapoor',
    phone: '+91 99887 65432',
    email: 'ananya@example.com',
    totalVisits: 8,
    totalSpent: 960000,
    avatarColor: '#FF9500',
    notes: 'Birthday in November',
  },
  {
    id: 'c4',
    name: 'Vikram Singh',
    phone: '+91 98001 23456',
    email: 'vikram@example.com',
    totalVisits: 3,
    totalSpent: 150000,
    avatarColor: '#AF52DE',
  },
  {
    id: 'c5',
    name: 'Deepa Nair',
    phone: '+91 97654 32100',
    email: 'deepa@example.com',
    totalVisits: 20,
    totalSpent: 2800000,
    avatarColor: '#FF2D55',
    notes: 'VIP client – always confirm 24hrs ahead',
  },
  {
    id: 'c6',
    name: 'Arjun Reddy',
    phone: '+91 90000 11223',
    email: 'arjun@example.com',
    totalVisits: 1,
    totalSpent: 60000,
    avatarColor: '#5AC8FA',
  },
];

// ─── Mock Services ────────────────────────────────────────────────────────────

export const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Haircut & Style',
    duration: 45,
    price: 80000,
    color: ServiceColors[0],
    bufferTime: 10,
  },
  {
    id: 's2',
    name: 'Hair Color (Full)',
    duration: 120,
    price: 250000,
    color: ServiceColors[1],
    bufferTime: 15,
  },
  {
    id: 's3',
    name: 'Facial',
    duration: 60,
    price: 120000,
    color: ServiceColors[2],
    bufferTime: 10,
  },
  {
    id: 's4',
    name: 'Manicure & Pedicure',
    duration: 75,
    price: 150000,
    color: ServiceColors[3],
  },
  {
    id: 's5',
    name: 'Head Massage',
    duration: 30,
    price: 60000,
    color: ServiceColors[4],
    bufferTime: 5,
  },
  {
    id: 's6',
    name: 'Bridal Package',
    duration: 240,
    price: 1200000,
    color: ServiceColors[7],
  },
];

// ─── Mock Staff ───────────────────────────────────────────────────────────────

export const mockStaff: StaffMember[] = [
  {
    id: 'st1',
    name: 'Meena',
    color: '#007AFF',
    services: ['s1', 's2', 's3', 's6'],
    workingHours: { start: '09:00', end: '18:00' },
  },
  {
    id: 'st2',
    name: 'Kavitha',
    color: '#34C759',
    services: ['s3', 's4', 's5'],
    workingHours: { start: '10:00', end: '19:00' },
  },
  {
    id: 'st3',
    name: 'Ravi',
    color: '#FF9500',
    services: ['s1', 's5'],
    workingHours: { start: '09:00', end: '17:00' },
  },
];

// ─── Mock Appointments ────────────────────────────────────────────────────────
// All times in UTC. Business timezone: Asia/Kolkata (IST = UTC+5:30)

const today = new Date();
const toISO = (offsetDays: number, hour: number, minute = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour - 5, minute === 0 ? 30 : minute - 30, 0, 0); // IST to UTC
  return d.toISOString();
};

export const mockAppointments: Appointment[] = [
  // Today
  {
    id: 'a1',
    clientId: 'c1',
    serviceId: 's1',
    staffId: 'st1',
    startTime: toISO(0, 10, 0),
    endTime: toISO(0, 10, 45),
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    totalAmount: 80000,
    advanceAmount: 0,
    notes: 'Regular trim, keep length on top',
  },
  {
    id: 'a2',
    clientId: 'c3',
    serviceId: 's3',
    staffId: 'st2',
    startTime: toISO(0, 12, 30),
    endTime: toISO(0, 13, 30),
    status: 'confirmed',
    paymentStatus: 'advance',
    paymentMethod: 'upi',
    totalAmount: 120000,
    advanceAmount: 50000,
  },
  {
    id: 'a3',
    clientId: 'c5',
    serviceId: 's6',
    staffId: 'st1',
    startTime: toISO(0, 15, 0),
    endTime: toISO(0, 19, 0),
    status: 'confirmed',
    paymentStatus: 'advance',
    paymentMethod: 'link',
    totalAmount: 1200000,
    advanceAmount: 500000,
    notes: 'Wedding on 5th Nov. Trial run today.',
  },
  // Tomorrow
  {
    id: 'a4',
    clientId: 'c2',
    serviceId: 's2',
    staffId: 'st1',
    startTime: toISO(1, 11, 0),
    endTime: toISO(1, 13, 0),
    status: 'confirmed',
    paymentStatus: 'unpaid',
    totalAmount: 250000,
    advanceAmount: 0,
  },
  {
    id: 'a5',
    clientId: 'c4',
    serviceId: 's5',
    staffId: 'st3',
    startTime: toISO(1, 14, 0),
    endTime: toISO(1, 14, 30),
    status: 'pending',
    paymentStatus: 'unpaid',
    totalAmount: 60000,
    advanceAmount: 0,
  },
  // Day after tomorrow
  {
    id: 'a6',
    clientId: 'c6',
    serviceId: 's4',
    staffId: 'st2',
    startTime: toISO(2, 10, 30),
    endTime: toISO(2, 11, 45),
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    totalAmount: 150000,
    advanceAmount: 0,
  },
  // 3 days ahead
  {
    id: 'a7',
    clientId: 'c1',
    serviceId: 's2',
    staffId: 'st1',
    startTime: toISO(3, 10, 0),
    endTime: toISO(3, 12, 0),
    status: 'confirmed',
    paymentStatus: 'advance',
    paymentMethod: 'upi',
    totalAmount: 250000,
    advanceAmount: 100000,
    repeatRule: 'monthly',
  },
  // Last week
  {
    id: 'a8',
    clientId: 'c3',
    serviceId: 's1',
    staffId: 'st3',
    startTime: toISO(-3, 9, 0),
    endTime: toISO(-3, 9, 45),
    status: 'no-show',
    paymentStatus: 'unpaid',
    totalAmount: 80000,
    advanceAmount: 0,
  },
  {
    id: 'a9',
    clientId: 'c5',
    serviceId: 's3',
    staffId: 'st2',
    startTime: toISO(-5, 11, 0),
    endTime: toISO(-5, 12, 0),
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    totalAmount: 120000,
    advanceAmount: 0,
  },
  // Future: spread across the month for dot indicators
  {
    id: 'a10',
    clientId: 'c2',
    serviceId: 's5',
    staffId: 'st3',
    startTime: toISO(5, 9, 30),
    endTime: toISO(5, 10, 0),
    status: 'confirmed',
    paymentStatus: 'unpaid',
    totalAmount: 60000,
    advanceAmount: 0,
  },
  {
    id: 'a11',
    clientId: 'c4',
    serviceId: 's3',
    staffId: 'st2',
    startTime: toISO(5, 14, 0),
    endTime: toISO(5, 15, 0),
    status: 'confirmed',
    paymentStatus: 'unpaid',
    totalAmount: 120000,
    advanceAmount: 0,
  },
  {
    id: 'a12',
    clientId: 'c6',
    serviceId: 's1',
    staffId: 'st1',
    startTime: toISO(7, 10, 0),
    endTime: toISO(7, 10, 45),
    status: 'pending',
    paymentStatus: 'unpaid',
    totalAmount: 80000,
    advanceAmount: 0,
  },
  {
    id: 'a13',
    clientId: 'c1',
    serviceId: 's4',
    staffId: 'st2',
    startTime: toISO(9, 16, 0),
    endTime: toISO(9, 17, 15),
    status: 'confirmed',
    paymentStatus: 'advance',
    paymentMethod: 'upi',
    totalAmount: 150000,
    advanceAmount: 75000,
  },
];

// ─── Helper Utilities ─────────────────────────────────────────────────────────

/** Returns the color for a given appointment status */
export function statusColor(status: AppointmentStatus): string {
  return StatusColors[status === 'no-show' ? 'noShow' : status];
}

/** Returns all appointments for a given date (YYYY-MM-DD in local time) */
export function appointmentsForDate(
  dateStr: string,
  timezone = 'Asia/Kolkata',
): Appointment[] {
  return mockAppointments.filter((apt) => {
    const localDate = new Date(apt.startTime).toLocaleDateString('en-CA', {
      timeZone: timezone,
    }); // YYYY-MM-DD
    return localDate === dateStr;
  });
}

/** Format paise to INR string */
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

/** Format a time string from an ISO date */
export function formatTime(isoDate: string, timezone = 'Asia/Kolkata'): string {
  return new Date(isoDate).toLocaleTimeString('en-IN', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/** Get client by ID */
export function getClient(clientId: string): Client | undefined {
  return mockClients.find((c) => c.id === clientId);
}

/** Get service by ID */
export function getService(serviceId: string): Service | undefined {
  return mockServices.find((s) => s.id === serviceId);
}

/** Get staff by ID */
export function getStaff(staffId: string): StaffMember | undefined {
  return mockStaff.find((s) => s.id === staffId);
}

/** Build date key YYYY-MM-DD for a Date object in IST */
export function dateKey(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}
