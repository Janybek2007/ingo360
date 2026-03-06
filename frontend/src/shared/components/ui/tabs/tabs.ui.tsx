import React from 'react';

import { cn } from '#/shared/utils/cn';

import type { ITabsProps as ITabsProperties } from './tabs.types';

export const Tabs: React.FC<ITabsProperties> = React.memo(
  ({ items, children, classNames, defaultValue, saveCurrent }) => {
    const getInitialValue = React.useCallback(() => {
      if (defaultValue) return defaultValue;
      const firstTab = items[0];
      if (firstTab.subItems && firstTab.subItems.length > 0) {
        return `${firstTab.value}/${firstTab.subItems[0].value}`;
      }
      return firstTab.value;
    }, [defaultValue, items]);

    const [current, setCurrent] = React.useState(getInitialValue);

    const handleMainTabClick = React.useCallback(
      (tabValue: string, subItems?: { value: string }[]) => {
        if (subItems && subItems.length > 0) {
          setCurrent(`${tabValue}/${subItems[0].value}`);
          saveCurrent?.(`${tabValue}/${subItems[0].value}`);
        } else {
          setCurrent(tabValue);
          saveCurrent?.(tabValue);
        }
      },
      [saveCurrent]
    );

    const handleSubTabClick = React.useCallback(
      (mainValue: string, subValue: string) => {
        setCurrent(`${mainValue}/${subValue}`);
        saveCurrent?.(`${mainValue}/${subValue}`);
      },
      [saveCurrent]
    );

    const [mainCurrent, subCurrent] = current.includes('/')
      ? current.split('/')
      : [current, undefined];

    return (
      <div
        className={cn(
          'font-roboto flex w-full flex-col items-start gap-6',
          classNames?.root
        )}
      >
        <div
          className={cn(
            'flex w-full flex-col gap-2 px-4 py-[0.875rem]',
            'rounded-2xl bg-white',
            classNames?.tabs
          )}
        >
          <div className="flex items-center gap-3">
            {items.map((t, index) => {
              const isActive = mainCurrent === t.value;
              return (
                <button
                  key={`${t.value}-${index}-key`}
                  className={cn(
                    'text-sm leading-[150%] font-normal text-black',
                    'rounded-full border border-transparent px-3 py-2',
                    'transition-all duration-300 ease-in-out',
                    'hover:bg-primary/10',
                    isActive && 'border-primary bg-primary/10',
                    classNames?.tab
                  )}
                  onClick={() => handleMainTabClick(t.value, t.subItems)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {items.find(item => item.value === mainCurrent)?.subItems && (
            <div
              className={cn(
                'flex items-center gap-2',
                'rounded-xl py-1',
                classNames?.tabs
              )}
            >
              {items
                .find(item => item.value === mainCurrent)
                ?.subItems?.map((subTab, index) => {
                  const isSubTabActive = subCurrent === subTab.value;
                  return (
                    <button
                      key={`${subTab.value}-${index}-subkey`}
                      className={cn(
                        'text-sm leading-[150%] font-normal text-black',
                        'rounded-full border border-transparent px-2 py-1',
                        'transition-all duration-300 ease-in-out',
                        'hover:bg-primary/10',
                        isSubTabActive && 'border-primary bg-primary/10',
                        classNames?.tab
                      )}
                      onClick={() =>
                        handleSubTabClick(mainCurrent, subTab.value)
                      }
                    >
                      {subTab.label}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {children && (
          <div className={cn(classNames?.content)} key={current}>
            {children?.({
              current: current,
            })}
          </div>
        )}
      </div>
    );
  }
);

Tabs.displayName = '_Tabs_';
