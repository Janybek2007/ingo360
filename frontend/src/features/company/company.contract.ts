import { z } from 'zod';

export const CompanyBaseContract = z.object({
  name: z.string().min(1, 'Поле обязательно'),
  ims_name: z.string().optional(),
  active_users_limit: z.union([z.string(), z.number()]).transform(Number),
  contract_number: z
    .union([z.string(), z.number()])
    .transform(value => String(value))
    .pipe(z.string().min(1, 'Поле обязательно')),
  contract_end_date: z.string().min(1, 'Поле обязательно'),
});

export const CompanyAccessContract = z.object({
  can_primary_sales: z.boolean().default(false),
  can_secondary_sales: z.boolean().default(false),
  can_tertiary_sales: z.boolean().default(false),
  can_visits: z.boolean().default(false),
  can_market_analysis: z.boolean().default(false),
});

export const AddCompanyContract = CompanyAccessContract.extend(
  CompanyBaseContract.shape
);

export const EditCompanyContract = CompanyAccessContract.extend({
  is_active: z.boolean().optional(),
}).extend(CompanyBaseContract.shape);

export type TAddCompanyContract = z.infer<typeof AddCompanyContract>;
export type TEditCompanyContract = z.infer<typeof EditCompanyContract>;
export type TCompanyBaseContract = z.infer<typeof CompanyBaseContract>;
export type TCompanyAccessContract = z.infer<typeof CompanyAccessContract>;
