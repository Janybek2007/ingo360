/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IItem } from '#/entities/reference';

export function transformReferenceData<T extends Record<string, any>>(
  data: T | null
) {
  if (!data) return null;

  const result: Record<string, any> = { ...data };

  for (const [key, value] of Object.entries(data)) {
    if (
      value &&
      typeof value === 'object' &&
      'id' in value &&
      'name' in value
    ) {
      result[`${key}_id`] = (value as IItem).id;
    }
  }

  return result;
}
