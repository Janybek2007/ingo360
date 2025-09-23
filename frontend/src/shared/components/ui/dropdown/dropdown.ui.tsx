import React from 'react';

import { useAnchorPosition } from '#/shared/hooks/use-anchor-position';
import { useClickAway } from '#/shared/hooks/use-click-away';
import { useToggle } from '#/shared/hooks/use-toggle';
import { cn } from '#/shared/utils/cn';
import { uiSet } from '#/shared/utils/ui-set';

import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import type { IDropdownProps } from './dropdown.types';

export const Dropdown: React.FC<IDropdownProps> = React.memo(
  ({ items, classNames, trigger }) => {
    const [open, { toggle, set }] = useToggle(false);
    const contentRef = useClickAway<HTMLDivElement>(() => set(false));
    const { position, updatePosition } = useAnchorPosition();

    return (
      <div
        className={cn('relative font-inter', classNames?.root)}
        ref={contentRef}
      >
        {trigger({
          open,
          onClick(e) {
            updatePosition(e);
            toggle();
          },
        })}

        {open && (
          <div
            style={{
              top: position.top + position.height,
              left: position.x,
            }}
            className={cn(
              'fixed z-10 w-max bg-white rounded-xl max-h-60 overflow-auto',
              'py-3 noscrollbar border border-[#E4E4E4] mt-2',
              classNames?.menu
            )}
          >
            {items.map((item, i) => (
              <button
                key={`${item.label}-${i}-key`}
                className={cn(
                  'flex items-center justify-between px-4 py-3 cursor-pointer text-left text-nowrap',
                  'w-full hover:bg-blue-500/10 hover:text-blue-500 text-black',
                  'text-base font-inter font-normal leading-full -tracking-[0.15px] group',
                  classNames?.menuItem
                )}
                onClick={() => {
                  item.onSelect?.();
                  set(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {item.icon && (
                    <Icon
                      {...uiSet.icon(item.icon, {
                        className: 'text-[#94A3B8] group-hover:text-blue-500',
                      })}
                    />
                  )}
                  {item.checkbox && <Checkbox {...item.checkbox} />}
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = '_Dropdown_';
