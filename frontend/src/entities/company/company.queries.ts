import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';

import type { GetCompanyResponse } from './company.types';

export class CompanyQueries {
  static queryKeys = {
    getCompanies: ['get-companies'],
  };

  static GetCompaniesQuery() {
    return queryOptions({
      queryKey: this.queryKeys.getCompanies,
      queryFn: async () => {
        const response = await http.get('companies').json<GetCompanyResponse>();
        return response;
      },
    });
  }
}
