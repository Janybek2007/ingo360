import { z } from 'zod';

export const AddCompanyContract = z.object({
  name: z.string().min(1, 'Поле обязательно'),
  accounts_limit: z.string().min(1, 'Поле обязательно'),
  contract_number: z.string().min(1, 'Поле обязательно'),
  contract_end_date: z.string().min(1, 'Поле обязательно'),
});

export type TAddCompanyContract = z.infer<typeof AddCompanyContract>;

export type TAddCompanyResponse = {
  company: {
    id: string;
    name: string;
    accounts_limit: string;
    contract_number: string;
    contract_end_date: string;
  };
};
