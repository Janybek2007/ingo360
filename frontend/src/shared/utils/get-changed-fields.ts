export const getChangedFields = <T extends Record<string, any>>(
  original: T,
  updated: Partial<T>
): Partial<T> => {
  const result: Partial<T> = {};

  for (const key of Object.keys(updated) as (keyof T)[]) {
    if (updated[key] !== original[key]) {
      result[key] = updated[key];
    }
  }

  return result;
};
