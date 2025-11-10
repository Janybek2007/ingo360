import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { ReferenceQueries } from '#/entities/reference';
import { Tabs } from '#/shared/components/ui/tabs';
import type { ReferencesType } from '#/shared/types/references.type';
import { ReferenceWork } from '#/widgets/operator/reference-work';

import { tabsItems } from './constants';

const ReferenceWorkPage: React.FC = () => {
  const [current, setCurrent] = useLocalStorageState('reference-work-tab', {
    defaultValue: 'geography/countries',
  });
  const [rowsCount, setRowsCount] = React.useState<'all' | number>('all');
  const queryData = useQuery(
    ReferenceQueries.GetReferencesQuery([current], {
      limit: rowsCount === 'all' ? undefined : rowsCount,
    })
  );

  const currentData = React.useMemo(() => {
    return queryData.data ? queryData.data[0] : [];
  }, [queryData]);

  return (
    <main>
      <Tabs
        saveCurrent={(current: ReferencesType) => setCurrent(current)}
        defaultValue={current}
        items={tabsItems}
      ></Tabs>

      <ReferenceWork
        currentData={currentData}
        current={current as ReferencesType}
        rowsCount={rowsCount}
        setRowsCount={setRowsCount}
        isLoading={queryData.isLoading}
        queryError={queryData.error}
        isEmpty={currentData.length === 0}
      />
    </main>
  );
};

export default ReferenceWorkPage;
