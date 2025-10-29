import { z } from 'zod';

export const AccessCompanyContract = z.object({
  can_primary_sales: z.enum(['true', 'false']),
  can_secondary_sales: z.enum(['true', 'false']),
  can_tertiary_sales: z.enum(['true', 'false']),
  can_visits: z.enum(['true', 'false']),
  can_market_analysis: z.enum(['true', 'false']),
});

export type TAccessCompanyContract = z.infer<typeof AccessCompanyContract>;
