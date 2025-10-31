export function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function randomArray<T extends 'number' | 'string' = 'number'>(
  length: number,
  min = 0,
  max = 100,
  type?: T
): T extends 'string' ? string[] : number[] {
  return Array.from({ length }, () => {
    const int = randomInt(min, max);
    return type === 'string' ? int.toString() : int;
  }) as T extends 'string' ? string[] : number[];
}

type ValueOrGenerator<T> = readonly T[] | ((index: number) => T);

type Schema = Record<string, ValueOrGenerator<any>>;

type SchemaToType<T extends Schema> = {
  [K in keyof T]: T[K] extends readonly (infer U)[]
    ? U
    : T[K] extends (index: number) => infer R
      ? R
      : never;
};

// --- Основная функция ---
export function generateMocks<T extends Schema>(
  count: number,
  schema: T
): SchemaToType<T>[] {
  return Array.from({ length: count }).map((_, i) => {
    const obj: any = {};
    for (const key of Object.keys(schema) as Array<keyof T>) {
      const value = schema[key];
      if (typeof value === 'function') {
        obj[key] = (value as (index: number) => unknown)(i);
      } else {
        obj[key] = pickOne(value as readonly unknown[]);
      }
    }
    return obj as SchemaToType<T>;
  });
}
