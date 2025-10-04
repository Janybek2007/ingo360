import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';
import React, { useState } from 'react';

import { type IReferenceItem, ReferenceQueries } from '#/entities/reference';
import { Tabs } from '#/shared/components/ui/tabs';
import type { ReferencesType } from '#/shared/types/references-type';
import { ReferenceWork } from '#/widgets/operator/reference-work';

import { tabsItems } from './constants';

const ReferenceWorkPage: React.FC = () => {
  const [current, setCurrent] = useQueryState(
    'current',
    parseAsString.withDefault('geography/countries')
  );
  const [currentData, setCurrentData] = useState<IReferenceItem[]>([]);

  const queryData = useQuery(ReferenceQueries.GetReferencesQuery([current]));

  React.useEffect(() => {
    setCurrentData(queryData.data ? queryData.data[0] : []);
  }, [queryData.data]);

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
        setCurrentData={setCurrentData}
      />
    </main>
  );
};

export default ReferenceWorkPage;
