import { z } from 'zod';

export const leadCreateValidator = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  serviceType: z.string().optional(),
  source: z.enum(['website', 'referral', 'phone', 'door_knock', 'social_media', 'other']).optional(),
  stage: z.enum(['new', 'contacted', 'quoted', 'won', 'lost']).optional(),
  estimatedValue: z.number().int().optional(),
  followUpDate: z.string().optional(),
  followUpNotes: z.string().optional(),
  notes: z.string().optional(),
  customerId: z.string().optional(),
  createdBy: z.enum(['manual', 'agent']).optional(),
});
