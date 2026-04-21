import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';

import type {
  GetCompaniesParams as GetCompaniesParameters,
  GetCompaniesResponse,
} from './company.types';

export const CompanyQueries = {
  queryKeys: {
    getCompanies: (parameters: GetCompaniesParameters) => [
      'get-companies',
      parameters,
    ],
  },

  GetCompaniesQuery(parameters: GetCompaniesParameters) {
    return queryOptions({
      queryKey: this.queryKeys.getCompanies(parameters),
      queryFn: async () => {
        const response = await http
          .get('companies', {
            searchParams: qs.stringify(parameters, {
              arrayFormat: 'comma',
            }),
          })
          .json<GetCompaniesResponse>();
        return response;
      },
    });
  },
};
