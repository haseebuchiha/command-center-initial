import { z } from 'zod';
import { DateTime } from 'luxon';

/**
 * Validates an ISO date string and converts it to a Date object for database storage.
 *
 * @example
 * // In server validator
 * export const storeOrderValidator = z.object({
 *   appointmentDate: validateIsoDate,
 * });
 */
export const validateIsoDate = z
  .string()
  .refine((val) => {
    // Check if it's a valid ISO date string
    const dt = DateTime.fromISO(val);
    return dt.isValid;
  }, 'Invalid date format')
  .transform((val) => {
    // Parse the ISO string and convert to Date object
    return new Date(val);
  });

/**
 * Optional version of validateIsoDate
 *
 * @example
 * // In server validator
 * export const updateOrderValidator = z.object({
 *   appointmentDate: validateIsoDateOptional,
 * });
 */
export const validateIsoDateOptional = z
  .string()
  .optional()
  .nullable()
  .refine((val) => {
    if (!val) return true;
    const dt = DateTime.fromISO(val);
    return dt.isValid;
  }, 'Invalid date format')
  .transform((val) => {
    if (!val) return null;
    return new Date(val);
  });
