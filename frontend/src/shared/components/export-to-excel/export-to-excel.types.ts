type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}` | `${K & string}.${NestedKeys<T[K]>}`
        : `${K & string}`;
    }[keyof T]
  : never;

export type ExportFormat<T> = {
  [K in NestedKeys<T>]?: string;
};

export type ExportToExcelProps<T extends object> = {
  data: T[];
  hasTotal?: boolean;
  fileName?: string;
  formatHeader?: ExportFormat<T | { total: number }>;
  selectKeys?: NestedKeys<T>[] | (string | false)[];
  periodKey?: string;
  periodAsPercent?: boolean;
  transform?: (item: T) => T;
};
