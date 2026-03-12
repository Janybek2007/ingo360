import type { IItem } from '#/entities/reference';

export function transformData(data: object | null) {
  if (!data) return null;

  const result: Record<string, any> = { ...data };

  for (const [key, value] of Object.entries(data)) {
    if (
      value &&
      typeof value === 'object' &&
      'id' in value &&
      ('name' in value || 'full_name' in value)
    ) {
      result[`${key}_id`] = (value as IItem).id;
    }
  }

  return result;
}
