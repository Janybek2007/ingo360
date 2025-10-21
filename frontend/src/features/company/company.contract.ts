import { z } from 'zod';

export const AddCompanyContract = z.object({
  name: z.string().min(1, 'Поле обязательно'),
  ims_name: z.string().min(1, 'Поле обязательно'),
  active_users_limit: z.union([z.string(), z.number()]).transform(Number),
  contract_number: z
    .union([z.string(), z.number()])
    .transform(value => String(value))
    .pipe(z.string().min(1, 'Поле обязательно')),
  contract_end_date: z.string().min(1, 'Поле обязательно'),
  can_primary_sales: z.boolean().default(false),
  can_secondary_sales: z.boolean().default(false),
  can_tertiary_sales: z.boolean().default(false),
  can_visits: z.boolean().default(false),
  can_market_analysis: z.boolean().default(false),
});

export const EditCompanyContract = z.object({
  name: z.string().min(1, 'Поле обязательно').optional(),
  ims_name: z.string().min(1, 'Поле обязательно').optional(),
  active_users_limit: z
    .union([z.string(), z.number()])
    .transform(Number)
    .optional(),
  contract_number: z
    .union([z.string(), z.number()])
    .transform(value => String(value))
    .pipe(z.string().min(1, 'Поле обязательно'))
    .optional(),
  contract_end_date: z.string().min(1, 'Поле обязательно').optional(),
  can_primary_sales: z.boolean().optional(),
  can_secondary_sales: z.boolean().optional(),
  can_tertiary_sales: z.boolean().optional(),
  can_visits: z.boolean().optional(),
  can_market_analysis: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export type TAddCompanyContract = z.infer<typeof AddCompanyContract>;
export type TEditCompanyContract = z.infer<typeof EditCompanyContract>;
