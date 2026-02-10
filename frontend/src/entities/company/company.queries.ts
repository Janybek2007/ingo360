import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';

import type { GetCompaniesParams, GetCompaniesResponse } from './company.types';

export class CompanyQueries {
  static queryKeys = {
    getCompanies: (params: GetCompaniesParams) => ['get-companies', params],
  };

  static GetCompaniesQuery(params: GetCompaniesParams) {
    return queryOptions({
      queryKey: this.queryKeys.getCompanies(params),
      queryFn: async () => {
        const response = await http
          .get('companies', {
            searchParams: qs.stringify(params, {
              arrayFormat: 'comma',
            }),
          })
          .json<GetCompaniesResponse>();
        return response;
      },
    });
  }
}
