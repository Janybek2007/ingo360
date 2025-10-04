import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';
import React from 'react';

import { ReferenceQueries } from '#/entities/reference';
import { Tabs } from '#/shared/components/ui/tabs';
import type { ReferencesType } from '#/shared/types/references.type';
import { ReferenceWork } from '#/widgets/operator/reference-work';

import { tabsItems } from './constants';

const ReferenceWorkPage: React.FC = () => {
  const [current, setCurrent] = useQueryState(
    'current',
    parseAsString.withDefault('geography/countries')
  );
  const queryData = useQuery(ReferenceQueries.GetReferencesQuery([current]));

  return (
    <main>
      <Tabs
        saveCurrent={(current: ReferencesType) => setCurrent(current)}
        defaultValue={current}
        items={tabsItems}
      ></Tabs>
      <ReferenceWork
        currentData={queryData.data ? queryData.data[0] : []}
        current={current as ReferencesType}
      />
    </main>
  );
};

export default ReferenceWorkPage;
