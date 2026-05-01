import type { ColumnFiltersState } from '@tanstack/react-table';

import type { TFilterPayloadValue } from '#/shared/types/global';
import type {
  TableFilterNumberValue,
  TableFilterSelectValue,
  TableFilterStringValue,
  TableFilterValue,
} from '#/shared/types/table-filters';

type TExtraDataMap = Record<string, TFilterPayloadValue>;

const isNullish = (v: unknown): v is null | undefined =>
  v === null || v === undefined;

const cleanValue = (value: TFilterPayloadValue): any => {
  if (Array.isArray(value)) {
    const cleaned = value.filter(v => !isNullish(v));
    return cleaned.length > 0 ? cleaned : undefined;
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

const appendExtraDataIfArray = (
  key: string,
  value: TFilterPayloadValue,
  extraDataMap: TExtraDataMap
): any => {
  if (!Array.isArray(value)) return value;

  const extraData = extraDataMap[key];
  if (isNullish(extraData)) return value;

  const result = [...value];
  if (Array.isArray(extraData)) result.push(...extraData);
  else result.push(extraData);

  return result;
};

export const transformColumnFiltersToPayload = (
  columnFilters: ColumnFiltersState,
  keyMap: Record<string, string> = {},
  extraDataMap: TExtraDataMap = {}
  // excludeKeys: string[] = [],
): Record<string, TFilterPayloadValue> => {
  const payload: Record<string, TFilterPayloadValue> = {};

  // @
  // const columnFilters = _columnFilters.filter(f => !excludeKeys.includes(f.id));

  for (const filter of columnFilters) {
    const mappedKey = keyMap[filter.id] ?? filter.id;
    const rawValue = filter.value as TableFilterValue;

    let result: TFilterPayloadValue;

    if (isSelectFilter(rawValue)) {
      result = processSelectFilter(rawValue, mappedKey, extraDataMap);
    } else if (isStringFilter(rawValue)) {
      result = processStringFilter(rawValue);
    } else if (isNumberFilter(rawValue)) {
      result = processNumberFilter(rawValue);
    }

    if (!isNullish(result!)) payload[mappedKey] = result!;
  }

  for (const [key, extraData] of Object.entries(extraDataMap)) {
    mergeExtraIntoPayload(payload, key, extraData);
  }

  const isActiveCount =
    columnFilters.filter(f => (keyMap[f.id] ?? f.id) === 'is_active').length +
    (extraDataMap['is_active'] === undefined ? 0 : 1);
  if (isActiveCount > 1) delete payload['is_active'];

  for (const k of Object.keys(payload)) {
    const cleaned = cleanValue(payload[k]);
    if (isNullish(cleaned)) delete payload[k];
    else payload[k] = cleaned;
  }

  const periodFilters: Record<string, TFilterPayloadValue> = {};
  for (const k of Object.keys(payload)) {
    if (/^\d{4}(-\d{2}|-Q\d+)?$/.test(k)) {
      periodFilters[k] = payload[k];
      delete payload[k];
    }
  }
  if (Object.keys(periodFilters).length > 0) {
    payload['period_filters'] = periodFilters as any;
  }

  return payload;
};

const processSelectFilter = (
  rawValue: TableFilterSelectValue,
  mappedKey: string,
  extraDataMap: TExtraDataMap
): TFilterPayloadValue => {
  const array = rawValue.selectValues.map(i => i.value) as TFilterPayloadValue;
  const withExtra = appendExtraDataIfArray(mappedKey, array, extraDataMap);

  if (mappedKey === 'mode') {
    const arr = Array.isArray(withExtra) ? withExtra : [];
    if (arr.length === 1) return arr[0];
    return undefined;
  }

  return cleanValue(withExtra);
};

const processStringFilter = (rawValue: TableFilterStringValue): any => {
  const v = rawValue.value?.trim();
  return v ? `${rawValue.type}:${v}` : undefined;
};

const processNumberFilter = (rawValue: TableFilterNumberValue): any => {
  if (rawValue.type === 'between') {
    const [a, b] = rawValue.value as [number, number];
    return isNullish(a) || isNullish(b) ? undefined : `between:${a},${b}`;
  }
  const v = rawValue.value;
  return isNullish(v) || Number.isNaN(v as any)
    ? undefined
    : `${rawValue.type}:${v}`;
};

const mergeExtraIntoPayload = (
  payload: Record<string, TFilterPayloadValue>,
  key: string,
  extraData: TFilterPayloadValue
): void => {
  const cleanedExtra = cleanValue(extraData);
  if (isNullish(cleanedExtra)) return;

  if (!(key in payload)) {
    payload[key] = Array.isArray(cleanedExtra)
      ? [...cleanedExtra]
      : cleanedExtra;
    return;
  }

  const current = payload[key];
  const merged = Array.isArray(current)
    ? [
        ...current,
        ...(Array.isArray(cleanedExtra) ? cleanedExtra : [cleanedExtra]),
      ]
    : cleanedExtra;

  const cleaned = cleanValue(merged as TFilterPayloadValue);
  if (isNullish(cleaned)) delete payload[key];
  else payload[key] = cleaned;
};
