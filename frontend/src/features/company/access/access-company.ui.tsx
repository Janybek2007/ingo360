import React from 'react';

import type { ICompanyItem } from '#/entities/company';
import { CreateEditModal } from '#/shared/components/create-edit-modal';

import {
  AccessCompanyContract,
  type TAccessCompanyContract,
} from './access-company.contract';
import { useAccessCompanyMutation } from './access-company.mutation';

interface AccessCompanyModalProps {
  onClose: VoidFunction;
  companyData: ICompanyItem;
}

export const AccessCompanyModal: React.FC<AccessCompanyModalProps> = React.memo(
  ({ onClose, companyData }) => {
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
        isLoading={accessMutation.isPending}
        alwaysEnablePrimary
        fields={[
          {
            label: 'Первичные продажи',
            name: 'can_primary_sales',
            defaultValue:
              typeof companyData.can_primary_sales === 'boolean'
                ? companyData.can_primary_sales
                  ? 'true'
                  : 'false'
                : 'true',
            type: 'select',
            selectItems: [
              { label: 'Да', value: 'true' },
              { label: 'Нет', value: 'false' },
            ],
          },
          {
            label: 'Вторичные продажи',
            name: 'can_secondary_sales',
            defaultValue:
              typeof companyData.can_secondary_sales === 'boolean'
                ? companyData.can_secondary_sales
                  ? 'true'
                  : 'false'
                : 'true',
            type: 'select',
            selectItems: [
              { label: 'Да', value: 'true' },
              { label: 'Нет', value: 'false' },
            ],
          },
          {
            label: 'Третичные продажи',
            name: 'can_tertiary_sales',
            defaultValue:
              typeof companyData.can_tertiary_sales === 'boolean'
                ? companyData.can_tertiary_sales
                  ? 'true'
                  : 'false'
                : 'true',
            type: 'select',
            selectItems: [
              { label: 'Да', value: 'true' },
              { label: 'Нет', value: 'false' },
            ],
          },
          {
            label: 'Визиты',
            name: 'can_visits',
            defaultValue:
              typeof companyData.can_visits === 'boolean'
                ? companyData.can_visits
                  ? 'true'
                  : 'false'
                : 'true',
            type: 'select',
            selectItems: [
              { label: 'Да', value: 'true' },
              { label: 'Нет', value: 'false' },
            ],
          },
          {
            label: 'Анализ рынка',
            name: 'can_market_analysis',
            defaultValue:
              typeof companyData.can_market_analysis === 'boolean'
                ? companyData.can_market_analysis
                  ? 'true'
                  : 'false'
                : 'true',
            type: 'select',
            selectItems: [
              { label: 'Да', value: 'true' },
              { label: 'Нет', value: 'false' },
            ],
          },
        ]}
        onClose={onClose}
        schema={AccessCompanyContract}
        title={`Настройки доступа компании "${companyData.name}"`}
        onSubmit={handleSubmit}
      />
    );
  }
);

AccessCompanyModal.displayName = '_AccessCompanyModal_';
