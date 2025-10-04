import { parseAsString, useQueryState } from 'nuqs';
import React from 'react';

import { Tabs } from '#/shared/components/ui/tabs';
import type { DbType } from '#/shared/types/db.type';
import { DbWork } from '#/widgets/operator/db-work';

import { tabsItems } from './constants';

const DbWorkPage: React.FC = () => {
  const [current, setCurrent] = useQueryState(
    'current',
    parseAsString.withDefault('sales_primary')
  );

  return (
    <main>
      <Tabs items={tabsItems} saveCurrent={setCurrent}></Tabs>
      <DbWork current={current as DbType} />
    </main>
  );
};

export default DbWorkPage;
