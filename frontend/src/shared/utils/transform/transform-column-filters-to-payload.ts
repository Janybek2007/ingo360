import type { ColumnFiltersState } from '@tanstack/react-table';

import type {
  TableFilterNumberValue,
  TableFilterSelectValue,
  TableFilterStringValue,
  TableFilterValue,
} from '#/shared/types/table-filters';

export type TFilterPayloadValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean | null | undefined>;

export type TExtraDataMap = Record<string, TFilterPayloadValue>;

const isNullish = (v: unknown): v is null | undefined =>
  v === null || v === undefined;

const cleanValue = (
  value: TFilterPayloadValue
): TFilterPayloadValue | undefined => {
  if (Array.isArray(value)) {
    const cleaned = value.filter(v => !isNullish(v));
    return cleaned.length ? cleaned : undefined;
  }
  return isNullish(value) ? undefined : value;
};

const isSelectFilter = (v: any): v is TableFilterSelectValue =>
  v &&
  typeof v === 'object' &&
  v.colType === 'select' &&
  Array.isArray(v.selectValues);

const isStringFilter = (v: any): v is TableFilterStringValue =>
  v &&
  typeof v === 'object' &&
  v.colType === 'string' &&
  typeof v.type === 'string';

const isNumberFilter = (v: any): v is TableFilterNumberValue =>
  v &&
  typeof v === 'object' &&
  v.colType === 'number' &&
  typeof v.type === 'string';

export const transformColumnFiltersToPayload = (
  columnFilters: ColumnFiltersState,
  keyMap: Record<string, string> = {},
  extraDataMap: TExtraDataMap = {}
): Record<string, TFilterPayloadValue> => {
  const appendExtraDataIfArray = (
    key: string,
    value: TFilterPayloadValue
  ): TFilterPayloadValue => {
    if (!Array.isArray(value)) return value;

    const extraData = extraDataMap[key];
    if (extraData === undefined || extraData === null) return value;

    if (Array.isArray(extraData)) value.push(...extraData);
    else value.push(extraData);

    return value;
  };

  const payload = columnFilters.reduce<Record<string, TFilterPayloadValue>>(
    (acc, filter) => {
      const mappedKey = keyMap[filter.id] ?? filter.id;
      const rawValue = filter.value as TableFilterValue;

      // ✅ select: [values]
      if (isSelectFilter(rawValue)) {
        const arr = rawValue.selectValues.map(
          i => i.value
        ) as TFilterPayloadValue;
        const withExtra = appendExtraDataIfArray(mappedKey, arr);
        const cleaned = cleanValue(withExtra);
        if (cleaned !== undefined) acc[mappedKey] = cleaned;
        return acc;
      }

      // ✅ string/number: "type:value"
      if (isStringFilter(rawValue)) {
        const v = rawValue.value?.trim();
        if (!v) return acc; // пустые строки не отправляем
        acc[mappedKey] = `${rawValue.type}:${v}`;
        return acc;
      }

      if (isNumberFilter(rawValue)) {
        const v = rawValue.value;

        // between -> "between:min,max"
        if (rawValue.type === 'between') {
          const [a, b] = v as [number, number];
          if (isNullish(a) || isNullish(b)) return acc;
          acc[mappedKey] = `between:${a},${b}`;
          return acc;
        }

        // остальные -> ">=:10"
        if (isNullish(v) || Number.isNaN(v as any)) return acc;
        acc[mappedKey] = `${rawValue.type}:${v}`;
        return acc;
      }

      return acc;
    },
    {}
  );

  const removeIfDuplicated = (key: string) => {
    const count =
      columnFilters.filter(f => (keyMap[f.id] ?? f.id) === key).length +
      (extraDataMap[key] !== undefined ? 1 : 0);

    if (count > 1) delete payload[key];
  };

  // merge extraDataMap
  Object.entries(extraDataMap).forEach(([key, extraData]) => {
    const cleanedExtra = cleanValue(extraData);
    if (cleanedExtra === undefined) return;

    if (!(key in payload)) {
      payload[key] = Array.isArray(cleanedExtra)
        ? [...(cleanedExtra as any[])]
        : cleanedExtra;
      return;
    }

    const currentValue = payload[key];

    if (Array.isArray(currentValue) && Array.isArray(cleanedExtra)) {
      currentValue.push(...cleanedExtra);
      const cleanedMerged = cleanValue(currentValue);
      if (cleanedMerged === undefined) delete payload[key];
      else payload[key] = cleanedMerged;
      return;
    }

    if (Array.isArray(currentValue) && !Array.isArray(cleanedExtra)) {
      currentValue.push(cleanedExtra as any);
      const cleanedMerged = cleanValue(currentValue);
      if (cleanedMerged === undefined) delete payload[key];
      else payload[key] = cleanedMerged;
      return;
    }
  });

  removeIfDuplicated('is_active');

  // финальная зачистка
  Object.keys(payload).forEach(k => {
    const cleaned = cleanValue(payload[k]);
    if (cleaned === undefined) delete payload[k];
    else payload[k] = cleaned;
  });

  return payload;
};
