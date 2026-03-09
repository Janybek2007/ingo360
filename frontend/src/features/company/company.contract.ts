import * as z from 'zod/mini';

const CompanyBaseContract = z.object({
  name: z.string().check(z.minLength(1, { message: "'Поле обязательно'" })),
  ims_name: z.optional(z.string()),
  active_users_limit: z.pipe(
    z.union([z.string(), z.number()]),
    z.transform(Number)
  ),
  contract_number: z.pipe(
    z.pipe(z.union([z.string(), z.number()]), z.transform(String)),
    z.string().check(z.minLength(1, 'Поле обязательно'))
  ),
  contract_end_date: z.string().check(z.minLength(1, 'Поле обязательно')),
});

const CompanyAccessContract = z.object({
  can_primary_sales: z.boolean(),
  can_secondary_sales: z.boolean(),
  can_tertiary_sales: z.boolean(),
  can_visits: z.boolean(),
  can_market_analysis: z.boolean(),
});

export const AddCompanyContract = z.extend(
  CompanyAccessContract,
  CompanyBaseContract.shape
);

export const EditCompanyContract = z.extend(
  z.extend(CompanyAccessContract, { is_active: z.optional(z.boolean()) }),
  CompanyBaseContract.shape
);

export type TAddCompanyContract = z.infer<typeof AddCompanyContract>;
export type TEditCompanyContract = z.infer<typeof EditCompanyContract>;
export type TCompanyAccessContract = z.infer<typeof CompanyAccessContract>;
