import React from 'react';
import z from 'zod';

import { CreateEditModal } from '#/shared/components/create-edit-modal';

export const AccessCompanyModal: React.FC<{ onClose: VoidFunction }> =
  React.memo(({ onClose }) => {
    return (
      <CreateEditModal
        isLoading={false}
        fields={[
          [
            {
              label: 'Can primary sales',
              name: 'can_primary_sales',
              defaultValue: 'false',
              type: 'select',
              selectItems: [
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ],
            },
            {
              label: 'Can secondary sales',
              name: 'can_secondary_sales',
              defaultValue: 'false',
              type: 'select',
              selectItems: [
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ],
            },
            {
              label: 'Can tertiary sales',
              name: 'can_tertiary_sales',
              defaultValue: 'false',
              type: 'select',
              selectItems: [
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ],
            },
            {
              label: 'Can visits',
              name: 'can_visits',
              defaultValue: 'false',
              type: 'select',
              selectItems: [
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ],
            },
            {
              label: 'Can market analysis',
              name: 'can_market_analysis',
              defaultValue: 'false',
              type: 'select',
              selectItems: [
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ],
            },
          ],
        ]}
        onClose={onClose}
        schema={z.object({
          can_primary_sales: z.enum(['true', 'false']),
          can_secondary_sales: z.enum(['true', 'false']),
          can_tertiary_sales: z.enum(['true', 'false']),
          can_visits: z.enum(['true', 'false']),
          can_market_analysis: z.enum(['true', 'false']),
        })}
        title="Настройки доступа компании"
        onSubmit={() => {}}
      />
    );
  });

AccessCompanyModal.displayName = '_AccessCompanyModal_';
