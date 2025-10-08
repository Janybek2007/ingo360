import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';
import React from 'react';

import { DbQueries } from '#/entities/db';
import { Tabs } from '#/shared/components/ui/tabs';
import type { DbType } from '#/shared/types/db.type';
import { DbWork } from '#/widgets/operator/db-work';

import { tabsItems } from './constants';

const DbWorkPage: React.FC = () => {
  const [current, setCurrent] = useQueryState(
    'current',
    parseAsString.withDefault('sales_primary')
  );

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery([current.replace('_', '/') as DbType])
  );

  return (
    <main>
      <Tabs items={tabsItems} defaultValue={current} saveCurrent={setCurrent} />
      <DbWork
        current={current.replace('_', '/') as DbType}
        currentData={queryData.data ? queryData.data[0] : []}
        isLoading={queryData.isLoading}
      />
    </main>
  );
};

export default DbWorkPage;
