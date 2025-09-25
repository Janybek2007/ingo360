import { type Column } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

import { useClickAway } from '#/shared/hooks/use-click-away';
import { cn } from '#/shared/utils/cn';

import { Icon } from '../../ui/icon';
import { type ISelectItem, Select } from '../../ui/select';

interface FilterPopupProps<T> {
  column: Column<T, unknown>;
  onClose: () => void;
  popupPosition: Omit<DOMRect, 'toJSON'>;
}

export function FilterPopup<T>({
  column,
  onClose,
  popupPosition,
}: FilterPopupProps<T>) {
  const [filterType, setFilterType] = useState<
    | 'contains'
    | 'startsWith'
    | 'equals'
    | 'doesNotEqual'
    | '>'
    | '>='
    | '<'
    | '<='
    | '='
    | 'between'
  >('contains');
  const [value, setValue] = useState<string | number>('');
  const [value2, setValue2] = useState<string | number>('');
  const contentRef = useClickAway<HTMLDivElement>(onClose);
  const isNumeric = column.columnDef.type === 'number';

  const applyFilter = useCallback(() => {
    if (filterType === 'between' && isNumeric) {
      column.setFilterValue({ type: filterType, value: [value, value2] });
    } else {
      column.setFilterValue({ type: filterType, value });
    }
    onClose();
  }, [column, filterType, value, value2, isNumeric, onClose]);

  const filterItems: ISelectItem[] = useMemo(
    () =>
      !isNumeric
        ? [
            { value: 'contains', label: 'Содержит' },
            { value: 'startsWith', label: 'Начинается с' },
            { value: 'equals', label: 'Точно равно' },
            { value: 'doesNotEqual', label: 'Не равно' },
          ]
        : [
            { value: '>', label: 'Больше чем' },
            { value: '>=', label: 'Больше или равно' },
            { value: '<', label: 'Меньше чем' },
            { value: '<=', label: 'Меньше или равно' },
            { value: '=', label: 'Точно равно' },
            { value: 'between', label: 'Между' },
          ],
    [isNumeric]
  );

  if (popupPosition.x === 0 || popupPosition.y === 0) return null;

  return (
    <div
      style={{
        top: popupPosition.y + popupPosition.height,
        left: popupPosition.x + popupPosition.width,
      }}
      ref={contentRef}
      className="absolute z-50 w-max bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 font-sans transition-all duration-200"
    >
      {/* Sort Section */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
          <Icon
            name="lucide:sort"
            size={16}
            className="text-gray-500 dark:text-gray-400"
          />
          Сортировка
        </h4>
        <div className="flex gap-2">
          <button
            className={cn(
              'flex-1 flex items-center justify-center gap-1 py-2 px-3 text-nowrap text-sm font-medium rounded-lg transition-colors duration-150',
              column.getIsSorted() === 'asc'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            )}
            onClick={() => column.toggleSorting(false)}
          >
            <Icon name="lucide:arrow-up" size={14} />
            По возрастанию
          </button>
          <button
            className={cn(
              'flex-1 flex items-center justify-center gap-1 py-2 px-3 text-nowrap text-sm font-medium rounded-lg transition-colors duration-150',
              column.getIsSorted() === 'desc'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            )}
            onClick={() => column.toggleSorting(true)}
          >
            <Icon name="lucide:arrow-down" size={14} />
            По убыванию
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
          <Icon
            name="lucide:filter"
            size={16}
            className="text-gray-500 dark:text-gray-400"
          />
          Фильтр
        </h4>
        <div className="flex flex-col gap-2">
          <Select
            value={filterType}
            setValue={setFilterType}
            items={filterItems}
            triggerText="Выберите фильтр"
            rightIcon={
              <Icon
                name="lucide:chevron-down"
                size={14}
                className="text-gray-500 dark:text-gray-400"
              />
            }
            classNames={{
              trigger:
                'w-full justify-between border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400',
              triggerText: 'text-gray-700 dark:text-gray-200',
              menu: 'border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg bg-white dark:bg-gray-700 mt-1',
              menuItem:
                'text-sm px-3 py-2 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors duration-150',
            }}
          />
          <input
            type={isNumeric ? 'number' : 'text'}
            value={value}
            onChange={e =>
              setValue(isNumeric ? Number(e.target.value) : e.target.value)
            }
            placeholder={isNumeric ? 'Число...' : 'Текст...'}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
          />
          {filterType === 'between' && isNumeric && (
            <input
              type="number"
              value={value2}
              onChange={e => setValue2(Number(e.target.value))}
              placeholder="Число (до)..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => {
            column.setFilterValue(undefined);
            column.clearSorting();
            onClose();
          }}
          className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-150"
        >
          Сбросить
        </button>
        <button
          onClick={onClose}
          className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-150"
        >
          Отмена
        </button>
        <button
          onClick={applyFilter}
          className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-150"
        >
          Применить
        </button>
      </div>
    </div>
  );
}
