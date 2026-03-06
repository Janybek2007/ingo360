import React from 'react';

import type { ICompanyItem } from '#/entities/company';
import { CreateEditModal } from '#/shared/components/create-edit-modal';

import {
  AccessCompanyContract,
  type TAccessCompanyContract,
} from './access-company.contract';
import { useAccessCompanyMutation } from './access-company.mutation';

interface AccessCompanyModalProperties {
  onClose: VoidFunction;
  companyData: ICompanyItem;
}

function getBooleanDefault(value?: boolean): 'true' | 'false' {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return 'true';
}

export const AccessCompanyModal: React.FC<AccessCompanyModalProperties> =
  React.memo(({ onClose, companyData }) => {
    const accessMutation = useAccessCompanyMutation(onClose);

    const handleSubmit = React.useCallback(
      (data: TAccessCompanyContract) => {
        accessMutation.mutate({
          id: companyData.id,
          body: data,
        });
      },
      [accessMutation, companyData.id]
    );
    return (
      <CreateEditModal
        isPending={accessMutation.isPending}
        alwaysEnablePrimary
        fields={[
          [
            {
              label: 'Первичные продажи',
              name: 'can_primary_sales',
              defaultValue: getBooleanDefault(companyData.can_primary_sales),
              type: 'select',
              selectItems: [
                { label: 'Да', value: 'true' },
                { label: 'Нет', value: 'false' },
              ],
            },
            {
              label: 'Вторичные продажи',
              name: 'can_secondary_sales',
              defaultValue: getBooleanDefault(companyData.can_secondary_sales),
              type: 'select',
              selectItems: [
                { label: 'Да', value: 'true' },
                { label: 'Нет', value: 'false' },
              ],
            },
            {
              label: 'Третичные продажи',
              name: 'can_tertiary_sales',
              defaultValue: getBooleanDefault(companyData.can_tertiary_sales),
              type: 'select',
              selectItems: [
                { label: 'Да', value: 'true' },
                { label: 'Нет', value: 'false' },
              ],
            },
            {
              label: 'Визиты',
              name: 'can_visits',
              defaultValue: getBooleanDefault(companyData.can_visits),
              type: 'select',
              selectItems: [
                { label: 'Да', value: 'true' },
                { label: 'Нет', value: 'false' },
              ],
            },
            {
              label: 'Анализ рынка',
              name: 'can_market_analysis',
              defaultValue: getBooleanDefault(companyData.can_market_analysis),
              type: 'select',
              selectItems: [
                { label: 'Да', value: 'true' },
                { label: 'Нет', value: 'false' },
              ],
            },
          ],
        ]}
        onClose={onClose}
        schema={AccessCompanyContract}
        title={`Настройки доступа компании "${companyData.name}"`}
        onSubmit={handleSubmit}
      />
    );
  });

AccessCompanyModal.displayName = '_AccessCompanyModal_';
