import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { DbQueries } from '#/entities/db';
import { Tabs } from '#/shared/components/ui/tabs';
import type { DbType } from '#/shared/types/db.type';
import { DbWork } from '#/widgets/operator/db-work';

import { tabsItems } from './constants';

const DbWorkPage: React.FC = () => {
  const [rowsCount, setRowsCount] = React.useState<'all' | number>('all');
  const [current, setCurrent] = useLocalStorageState('db-work-tab', {
    defaultValue: 'sales_primary',
  });
  const [groupBy, setGroupBy] = React.useState<string[]>(() =>
    getDefaultGroupBy(current)
  );

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery([current.replace('_', '/') as DbType], {
      limit: rowsCount === 'all' ? undefined : rowsCount,
      group_by_dimensions: groupBy,
    })
  );

  const currentData = React.useMemo(() => {
    return queryData.data ? queryData.data[0] : [];
  }, [queryData.data]);

  return (
    <main>
      <Tabs
        items={tabsItems}
        defaultValue={current}
        saveCurrent={value => {
          setCurrent(value);
          setGroupBy(getDefaultGroupBy(value));
        }}
      />

      <DbWork
        current={current.replace('_', '/') as DbType}
        currentData={currentData}
        rowsCount={rowsCount}
        setRowsCount={setRowsCount}
        groupBy={groupBy}
        onGroupChange={setGroupBy}
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      />
    </main>
  );
};

export default DbWorkPage;

function getDefaultGroupBy(current: string) {
  if (current === 'sales_primary') {
    return ['distributor', 'brand', 'sku'];
  }

  if (['sales_secondary', 'sales_tertiary'].includes(current)) {
    return ['distributor', 'brand', 'sku', 'pharmacy'];
  }

  if (current === 'visits') {
    return [
      'pharmacy',
      'employee',
      'product_group',
      'medical_facility',
      'doctor',
      'client_type',
    ];
  }

  return [];
}
