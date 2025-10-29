import React from 'react';
import z from 'zod';

import type { ICompanyItem } from '#/entities/company';
import { CreateEditModal } from '#/shared/components/create-edit-modal';

import { useAccessCompanyMutation } from './access-company.mutation';

interface AccessCompanyModalProps {
  onClose: VoidFunction;
  companyData: ICompanyItem;
}

export const AccessCompanyModal: React.FC<AccessCompanyModalProps> = React.memo(
  ({ onClose, companyData }) => {
    const accessMutation = useAccessCompanyMutation(onClose);

    const handleSubmit = (data: Record<string, string>) => {
      const transformedData = {
        can_primary_sales: data.can_primary_sales === 'true',
        can_secondary_sales: data.can_secondary_sales === 'true',
        can_tertiary_sales: data.can_tertiary_sales === 'true',
        can_visits: data.can_visits === 'true',
        can_market_analysis: data.can_market_analysis === 'true',
      };

      accessMutation.mutate({
        id: companyData.id,
        body: transformedData,
      });
    };

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
        schema={z.object({
          can_primary_sales: z.enum(['true', 'false']),
          can_secondary_sales: z.enum(['true', 'false']),
          can_tertiary_sales: z.enum(['true', 'false']),
          can_visits: z.enum(['true', 'false']),
          can_market_analysis: z.enum(['true', 'false']),
        })}
        title={`Настройки доступа компании "${companyData.name}"`}
        onSubmit={handleSubmit}
      />
    );
  }
);

AccessCompanyModal.displayName = '_AccessCompanyModal_';
