import { DateTime } from 'luxon';

/**
 * Converts a Date object to an ISO string that preserves the local date/time
 * without converting to UTC. This is used for "floating" dates that should
 * remain the same regardless of timezone.
 *
 * Example: If user selects Jan 15, 2024 in any timezone, it should remain
 * Jan 15, 2024 when stored and displayed.
 */
export function toFloatingDateString(date: Date) {
  // Create DateTime from the local date, then change to UTC keeping the local time
  const iso = DateTime.fromJSDate(date)
    .setZone('utc', { keepLocalTime: true })
    .toISO();

  // toISO() can return null if the DateTime is invalid
  if (!iso) {
    throw new Error('Invalid date provided to toFloatingDateString');
  }

  return iso;
}

/**
 * Converts a Date object to another Date object treating the UTC values
 *
 * @param date
 * @returns
 */
export function fromFloatingDate(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
}

/**
 * Converts a UTC ISO string back to a Date object, treating the UTC values
 * as if they were local time. This is the inverse of toFloatingDateString.
 *
 * Example: ISO string "2024-01-15T00:00:00.000Z" returns a Date representing
 * Jan 15 in the local timezone (not Jan 14 or 16 due to timezone conversion).
 */
export function fromFloatingDateString(isoString: string) {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid ISO string provided to fromFloatingDateString');
  }

  return fromFloatingDate(date);
}

/**
 * Formats a floating date for display, treating it as UTC to preserve the date.
 * This ensures the date displays the same regardless of the user's timezone.
 */
export function formatFloatingDate(
  date: Date | string | null | undefined,
  format: string = 'MMM dd, yyyy'
) {
  if (!date) return '-';

  // Convert to Date object if string
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Format using UTC to preserve the stored date
  return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(format);
}

/**
 * Converts a date to start of day in the user's local timezone for inclusive timestamp ranges.
 * Used for the "from" date in timestamp filters.
 */
export function toStartOfDayTimestamp(date: Date) {
  const iso = DateTime.fromJSDate(date).startOf('day').toISO();

  if (!iso) {
    throw new Error('Invalid date provided to toStartOfDayTimestamp');
  }

  return iso;
}

/**
 * Converts a date to end of day in the user's local timezone for inclusive timestamp ranges.
 * Used for the "to" date in timestamp filters.
 */
export function toEndOfDayTimestamp(date: Date) {
  const iso = DateTime.fromJSDate(date).endOf('day').toISO();

  if (!iso) {
    throw new Error('Invalid date provided to toEndOfDayTimestamp');
  }

  return iso;
}

/**
 * Normalizes a filter date value (Date | string) to a Date object for display.
 * Handles both floating dates and timestamps appropriately.
 */
export function normalizeFilterDate(
  value: Date | string | null | undefined,
  dateType: 'floating' | 'timestamp' = 'timestamp'
) {
  if (!value) return undefined;

  const date = typeof value === 'string' ? new Date(value) : value;

  // For floating dates, we need to preserve local time
  return dateType === 'floating' ? fromFloatingDate(date) : date;
}

/**
 * Formats a filter date value for display.
 * Handles both Date objects and strings, and respects floating vs timestamp behavior.
 */
export function formatFilterDateDisplay(
  value: Date | string | null | undefined,
  dateType: 'floating' | 'timestamp' = 'timestamp',
  format: string
) {
  if (!value) return '';

  const date = typeof value === 'string' ? new Date(value) : value;

  if (dateType === 'floating') {
    return formatFloatingDate(date, format);
  }

  return DateTime.fromJSDate(date).toLocal().toFormat(format);
}
