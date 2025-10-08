import { z } from 'zod';

export const AddCustomerContract = z.object({
  email: z.email('Неверный email'),
  company_id: z.number('Выберите компанию'),
});

export const EditCustomerContract = AddCustomerContract.partial();

export type TAddCustomerContract = z.infer<typeof AddCustomerContract>;
