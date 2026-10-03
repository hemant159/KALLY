/**
 * Indian Public Holidays 2010–2035
 *
 * Fixed holidays are generated for any year automatically.
 * Variable (lunar/moveable) holidays are pre-computed per year.
 */

// ─── Fixed holidays (same date every year) ────────────────────────────────────
const FIXED: Array<{ md: string; name: string }> = [
  { md: '01-26', name: 'Republic Day' },
  { md: '04-14', name: 'Ambedkar Jayanti' },
  { md: '05-01', name: 'Labour Day' },
  { md: '08-15', name: 'Independence Day' },
  { md: '10-02', name: 'Gandhi Jayanti' },
  { md: '12-25', name: 'Christmas' },
];

// ─── Variable holidays per year ───────────────────────────────────────────────
const VARIABLE: Record<string, string> = {
  // ── 2020 ──
  '2020-01-14': 'Makar Sankranti',
  '2020-02-21': 'Maha Shivratri',
  '2020-03-10': 'Holi',
  '2020-04-02': 'Good Friday',
  '2020-04-06': 'Rama Navami',
  '2020-04-14': 'Ambedkar Jayanti',
  '2020-05-07': 'Buddha Purnima',
  '2020-07-31': 'Eid ul-Adha',
  '2020-08-03': 'Raksha Bandhan',
  '2020-08-12': 'Janmashtami',
  '2020-10-25': 'Dussehra',
  '2020-11-14': 'Diwali',
  '2020-11-30': 'Guru Nanak Jayanti',

  // ── 2021 ──
  '2021-01-14': 'Makar Sankranti',
  '2021-03-11': 'Maha Shivratri',
  '2021-03-29': 'Holi',
  '2021-04-02': 'Good Friday',
  '2021-04-25': 'Rama Navami',
  '2021-05-26': 'Buddha Purnima',
  '2021-07-20': 'Eid ul-Adha',
  '2021-08-22': 'Janmashtami',
  '2021-10-15': 'Dussehra',
  '2021-11-04': 'Diwali',
  '2021-11-19': 'Guru Nanak Jayanti',

  // ── 2022 ──
  '2022-01-14': 'Makar Sankranti',
  '2022-03-01': 'Maha Shivratri',
  '2022-03-18': 'Holi',
  '2022-04-02': 'Rama Navami',
  '2022-04-15': 'Good Friday',
  '2022-05-16': 'Buddha Purnima',
  '2022-07-10': 'Eid ul-Adha',
  '2022-08-11': 'Raksha Bandhan',
  '2022-08-19': 'Janmashtami',
  '2022-10-05': 'Dussehra',
  '2022-10-24': 'Diwali',
  '2022-11-08': 'Guru Nanak Jayanti',

  // ── 2023 ──
  '2023-01-14': 'Makar Sankranti',
  '2023-02-18': 'Maha Shivratri',
  '2023-03-08': 'Holi',
  '2023-03-30': 'Rama Navami',
  '2023-04-07': 'Good Friday',
  '2023-05-05': 'Buddha Purnima',
  '2023-06-29': 'Eid ul-Adha',
  '2023-08-30': 'Raksha Bandhan',
  '2023-09-07': 'Janmashtami',
  '2023-10-24': 'Dussehra',
  '2023-11-13': 'Diwali',
  '2023-11-27': 'Guru Nanak Jayanti',

  // ── 2024 ──
  '2024-01-14': 'Makar Sankranti',
  '2024-01-22': 'Ram Mandir Consecration',
  '2024-03-08': 'Maha Shivratri',
  '2024-03-25': 'Holi',
  '2024-04-14': 'Ambedkar Jayanti',
  '2024-04-17': 'Ram Navami',
  '2024-04-19': 'Good Friday',
  '2024-05-23': 'Buddha Purnima',
  '2024-06-17': 'Eid ul-Adha',
  '2024-08-19': 'Raksha Bandhan',
  '2024-08-26': 'Janmashtami',
  '2024-10-12': 'Dussehra',
  '2024-11-01': 'Diwali',
  '2024-11-15': 'Guru Nanak Jayanti',

  // ── 2025 ──
  '2025-01-14': 'Makar Sankranti',
  '2025-02-26': 'Maha Shivratri',
  '2025-03-14': 'Holi',
  '2025-03-31': 'Eid ul-Fitr',
  '2025-04-06': 'Ram Navami',
  '2025-04-14': 'Ambedkar Jayanti',
  '2025-04-18': 'Good Friday',
  '2025-05-12': 'Buddha Purnima',
  '2025-06-07': 'Eid ul-Adha',
  '2025-08-09': 'Raksha Bandhan',
  '2025-08-16': 'Janmashtami',
  '2025-10-02': 'Dussehra', // Same as Gandhi Jayanti
  '2025-10-20': 'Diwali',
  '2025-11-05': 'Guru Nanak Jayanti',

  // ── 2026 ──
  '2026-01-14': 'Makar Sankranti',
  '2026-02-17': 'Maha Shivratri',
  '2026-03-04': 'Holi',
  '2026-03-20': 'Good Friday',
  '2026-03-21': 'Eid ul-Fitr',
  '2026-03-27': 'Ram Navami',
  '2026-05-24': 'Buddha Purnima',
  '2026-06-28': 'Eid ul-Adha',
  '2026-08-28': 'Janmashtami',
  '2026-09-29': 'Navratri (Start)',
  '2026-10-10': 'Dussehra',
  '2026-10-29': 'Diwali',
  '2026-11-13': 'Guru Nanak Jayanti',

  // ── 2027 ──
  '2027-01-14': 'Makar Sankranti',
  '2027-02-07': 'Maha Shivratri',
  '2027-03-23': 'Holi',
  '2027-03-26': 'Good Friday',
  '2027-04-11': 'Eid ul-Fitr',
  '2027-04-16': 'Ram Navami',
  '2027-05-13': 'Buddha Purnima',
  '2027-06-18': 'Eid ul-Adha',
  '2027-08-17': 'Janmashtami',
  '2027-10-18': 'Dussehra',
  '2027-11-07': 'Diwali',
  '2027-11-22': 'Guru Nanak Jayanti',

  // ── 2028 ──
  '2028-01-14': 'Makar Sankranti',
  '2028-02-25': 'Maha Shivratri',
  '2028-03-11': 'Holi',
  '2028-03-31': 'Eid ul-Fitr',
  '2028-04-04': 'Ram Navami',
  '2028-04-14': 'Good Friday',
  '2028-05-31': 'Buddha Purnima',
  '2028-06-06': 'Eid ul-Adha',
  '2028-09-04': 'Janmashtami',
  '2028-10-06': 'Dussehra',
  '2028-10-25': 'Diwali',
  '2028-11-10': 'Guru Nanak Jayanti',

  // ── 2029 ──
  '2029-01-14': 'Makar Sankranti',
  '2029-02-13': 'Maha Shivratri',
  '2029-03-02': 'Holi',
  '2029-03-20': 'Eid ul-Fitr',
  '2029-03-30': 'Good Friday',
  '2029-04-21': 'Ram Navami',
  '2029-05-20': 'Buddha Purnima',
  '2029-05-27': 'Eid ul-Adha',
  '2029-08-24': 'Janmashtami',
  '2029-10-14': 'Dussehra',
  '2029-11-02': 'Diwali',
  '2029-11-29': 'Guru Nanak Jayanti',

  // ── 2030 ──
  '2030-01-14': 'Makar Sankranti',
  '2030-03-03': 'Maha Shivratri',
  '2030-03-22': 'Holi',
  '2030-03-09': 'Eid ul-Fitr',
  '2030-04-19': 'Good Friday',
  '2030-04-10': 'Ram Navami',
  '2030-05-09': 'Buddha Purnima',
  '2030-05-16': 'Eid ul-Adha',
  '2030-09-13': 'Janmashtami',
  '2030-10-03': 'Dussehra',
  '2030-10-22': 'Diwali',
  '2030-11-18': 'Guru Nanak Jayanti',
};

/**
 * Returns the holiday name for a given date string (YYYY-MM-DD),
 * or undefined if no holiday.
 */
export function getHoliday(dateStr: string): string | undefined {
  // Variable holiday check first
  if (VARIABLE[dateStr]) return VARIABLE[dateStr];
  // Fixed holiday check
  const md = dateStr.slice(5); // "MM-DD"
  return FIXED.find((h) => h.md === md)?.name;
}

/** Returns true if the given date string is a holiday */
export function isHoliday(dateStr: string): boolean {
  return getHoliday(dateStr) !== undefined;
}
