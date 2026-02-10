// Полный вариант с фильтрацией null/undefined (и опционально пустых значений)
// + исправлен баг в appendExtraDataIfArray (у тебя там условие было наоборот)

import type { ColumnFiltersState } from '@tanstack/react-table';

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

const isEmptyString = (v: unknown) => typeof v === 'string' && v.trim() === '';

const isNaNNumber = (v: unknown) => typeof v === 'number' && Number.isNaN(v);

const cleanValue = (
  value: TFilterPayloadValue
): TFilterPayloadValue | undefined => {
  // null/undefined
  if (isNullish(value)) return undefined;

  // string
  if (isEmptyString(value)) return undefined;

  // number
  if (isNaNNumber(value)) return undefined;

  // array
  if (Array.isArray(value)) {
    const cleaned = value
      .filter(v => !isNullish(v))
      .filter(v => !isEmptyString(v))
      .filter(v => !isNaNNumber(v));

    if (cleaned.length === 0) return undefined;

    return cleaned as TFilterPayloadValue;
  }

  return value;
};

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

    if (Array.isArray(extraData)) {
      value.push(...extraData);
      return value;
    }

    value.push(extraData);
    return value;
  };

  const payload = columnFilters.reduce<Record<string, TFilterPayloadValue>>(
    (acc, filter) => {
      const mappedKey = keyMap[filter.id] ?? filter.id;
      const rawValue: any = filter.value;

      // 1) selectValues: [{value: ...}]
      if (
        rawValue &&
        typeof rawValue === 'object' &&
        'selectValues' in rawValue &&
        Array.isArray(rawValue.selectValues)
      ) {
        const arr = rawValue.selectValues.map(
          (item: any) => item.value
        ) as TFilterPayloadValue;
        const withExtra = appendExtraDataIfArray(mappedKey, arr);
        const cleaned = cleanValue(withExtra);
        if (cleaned !== undefined) acc[mappedKey] = cleaned;
        return acc;
      }

      // 2) value: { value: ... }
      if (
        rawValue &&
        typeof rawValue === 'object' &&
        'value' in rawValue &&
        rawValue.value !== undefined
      ) {
        const cleaned = cleanValue(rawValue.value as TFilterPayloadValue);
        if (cleaned !== undefined) acc[mappedKey] = cleaned;
        return acc;
      }

      // 3) primitives
      if (
        typeof rawValue === 'string' ||
        typeof rawValue === 'number' ||
        typeof rawValue === 'boolean' ||
        rawValue === null ||
        rawValue === undefined
      ) {
        const cleaned = cleanValue(rawValue as TFilterPayloadValue);
        if (cleaned !== undefined) acc[mappedKey] = cleaned;
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

  Object.keys(payload).forEach(k => {
    const cleaned = cleanValue(payload[k]);
    if (cleaned === undefined) delete payload[k];
    else payload[k] = cleaned;
  });

  return payload;
};
