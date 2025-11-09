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
  const [groupBy, setGroupBy] = React.useState<string[]>([]);

  const [current, setCurrent] = useLocalStorageState('db-work-tab', {
    defaultValue: 'sales/tertiary/reports/sales',
  });

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery([current.replace('_', '/') as DbType], {
      limit: rowsCount === 'all' ? undefined : rowsCount,
      group_by_dimensions: groupBy,
    })
  );

  const currentData = React.useMemo(() => {
    const data = queryData.data ? queryData.data[0] : [];
    return data.slice(0, rowsCount === 'all' ? data.length : rowsCount);
  }, [queryData, rowsCount]);

  return (
    <main>
      <Tabs items={tabsItems} defaultValue={current} saveCurrent={setCurrent} />

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
