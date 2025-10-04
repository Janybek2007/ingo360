import { z } from 'zod';

export const AddCompanyContract = z.object({
  name: z.string().min(1, 'Поле обязательно'),
  active_users_limit: z.union([z.string(), z.number()]).transform(Number),
  contract_number: z.string().min(1, 'Поле обязательно'),
  contract_end_date: z.string().min(1, 'Поле обязательно'),
  can_primary_sales: z.boolean().default(false),
  can_secondary_sales: z.boolean().default(false),
  can_tertiary_sales: z.boolean().default(false),
  can_visits: z.boolean().default(false),
  can_market_analysis: z.boolean().default(false),
});

export const EditCompanyContract = AddCompanyContract.optional();

export type TAddCompanyContract = z.infer<typeof AddCompanyContract>;
