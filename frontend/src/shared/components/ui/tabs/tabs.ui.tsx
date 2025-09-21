import React from 'react';

import { cn } from '#/shared/utils/cn';

import type { ITabsProps } from './tabs.types';

export const Tabs: React.FC<ITabsProps> = React.memo(
  ({ items, children, classNames, defaultValue, saveCurrent }) => {
    const [current, setCurrent] = React.useState(
      defaultValue || items[0].value
    );

    return (
      <div
        className={cn(
          'flex flex-col gap-6 items-start w-full',
          classNames?.root
        )}
      >
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-[14px] w-full',
            'bg-white border border-[#E4E4E4] rounded-2xl',
            classNames?.tabs
          )}
        >
          {items.map((t, i) => {
            const isActive = current === t.value;
            return (
              <button
                key={`${t.value}-${i}-key`}
                className={cn(
                  'font-normal text-sm leading-[150%] text-black',
                  'border border-transparent px-3 py-2 rounded-full',
                  'transition-all duration-300 ease-in-out',
                  'hover:bg-primary/10',
                  isActive && 'border-primary bg-primary/10'
                )}
                onClick={() => {
                  setCurrent(t.value);
                  saveCurrent(t.value);
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className={cn(classNames?.content)} key={current}>
          {children?.({ current, set: newV => setCurrent(newV) })}
        </div>
      </div>
    );
  }
);

Tabs.displayName = '_Tabs_';
