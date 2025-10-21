import { z } from 'zod';

export const AccessCompanyContract = z.object({
  can_primary_sales: z.boolean(),
  can_secondary_sales: z.boolean(),
  can_tertiary_sales: z.boolean(),
  can_visits: z.boolean(),
  can_market_analysis: z.boolean(),
});

export type TAccessCompanyContract = z.infer<typeof AccessCompanyContract>;
