import React from 'react';

import { Tabs } from '#/shared/components/ui/tabs';

const VisitActivityPage: React.FC = () => {
  return (
    <main>
      <Tabs
        items={[
          { label: 'Анализ визитной активности', value: 'visit_analysis' },
          { label: 'По третичным продажам', value: 'tertiary_sales' },
          { label: 'Анализ охват специалистов', value: 'specialist_coverage' },
        ]}
      >
        {({ current }) => (
          <div>
            <p>Текущая вкладка: {current}</p>
          </div>
        )}
      </Tabs>
    </main>
  );
};

export default VisitActivityPage;
