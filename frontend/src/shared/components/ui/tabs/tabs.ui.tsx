import React from 'react';

import { cn } from '#/shared/utils/cn';

import type { ITabsProps } from './tabs.types';

export const Tabs: React.FC<ITabsProps> = React.memo(
  ({ items, children, classNames, defaultValue, saveCurrent }) => {
    const [current, setCurrent] = React.useState(
      defaultValue || items[0].value
    );
    const [currentSubTab, setCurrentSubTab] = React.useState<
      string | undefined
    >(
      items[0].subItems && items[0].subItems.length > 0
        ? items[0].subItems[0].value
        : undefined
    );

    React.useEffect(() => {
      const activeTab = items.find(item => item.value === current);
      if (activeTab?.subItems && activeTab.subItems.length > 0) {
        setCurrentSubTab(activeTab.subItems[0].value);
      } else {
        setCurrentSubTab(undefined);
      }
    }, [current, items]);

    return (
      <div
        className={cn(
          'flex flex-col gap-6 items-start w-full',
          classNames?.root
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-2 px-4 py-[14px] w-full',
            'bg-white border border-[#E4E4E4] rounded-2xl',
            classNames?.tabs
          )}
        >
          <div className={cn('flex items-center gap-3')}>
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
                    isActive && 'border-primary bg-primary/10',
                    classNames?.tab
                  )}
                  onClick={() => {
                    setCurrent(t.value);
                    saveCurrent?.(t.value);
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {items.find(item => item.value === current)?.subItems && (
            <div
              className={cn(
                'flex items-center gap-2',
                'bg-gray-50 rounded-xl py-1',
                classNames?.tabs
              )}
            >
              {items
                .find(item => item.value === current)
                ?.subItems?.map((subTab, i) => {
                  const isSubTabActive = currentSubTab === subTab.value;
                  return (
                    <button
                      key={`${subTab.value}-${i}-subkey`}
                      className={cn(
                        'font-normal text-sm leading-[150%] text-black',
                        'border border-transparent px-2 py-1 rounded-full',
                        'transition-all duration-300 ease-in-out',
                        'hover:bg-primary/10',
                        isSubTabActive && 'border-primary bg-primary/10',
                        classNames?.tab
                      )}
                      onClick={() => setCurrentSubTab(subTab.value)}
                    >
                      {subTab.label}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Контент */}
        <div className={cn(classNames?.content)} key={current}>
          {children?.({
            current,
            currentSubTab,
          })}
        </div>
      </div>
    );
  }
);

Tabs.displayName = '_Tabs_';
