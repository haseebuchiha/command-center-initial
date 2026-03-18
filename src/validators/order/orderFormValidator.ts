import { z } from 'zod';

export const orderFormValidator = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  bizName: z.string().min(1, 'Business name is required'),
  bizDesc: z.string().min(1, 'Please describe your business'),
  idealCustomer: z.string().optional(),
  bizType: z.string().min(1, 'Please select a business type'),
  industry: z.string().optional(),
  goals: z.array(z.string()),
  hasWebsite: z.boolean(),
  currentUrl: z.string().optional(),
  revenueGoal: z.string().optional(),
  theme: z.string().min(1, 'Please select a theme'),
  inspireUrls: z.array(z.string()),
  colors: z.string().optional(),
});
