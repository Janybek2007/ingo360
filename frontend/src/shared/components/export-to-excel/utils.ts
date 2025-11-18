export function getNestedValue<T>(obj: T, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object'
      ? (current as any)[key]
      : undefined;
  }, obj as any);
}

export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = current[key] || {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

const formatPeriodKey = (period: string): string => {
  const [year, month] = period.split('-');
  return `${year}-${parseInt(month, 10)}`;
};

const isPeriodObject = (value: any): boolean => {
  if (!value || typeof value !== 'object') return false;
  return Object.keys(value).some(key => /^\d{4}-\d{2}$/.test(key));
};

export const hasPeriods = <T extends object>(data: T[]): boolean => {
  if (!data || data.length === 0) return false;
  const firstItem = data[0];
  return Object.values(firstItem).some(value => isPeriodObject(value));
};

export const flattenPeriodData = <T extends object>(
  data: T[],
  periodKey: string,
  periodAsPercent = false
): { formattedData: any[]; periodKeys: string[] } => {
  const periodKeys: string[] = [];
  const formattedData = data.map(item => {
    const newItem: any = { ...item };
    const periodDataKey = Object.keys(item).find(key =>
      isPeriodObject(item[key as keyof T])
    );
    if (!periodDataKey) return newItem;
    const periodData = item[periodDataKey as keyof T] as any;
    delete newItem[periodDataKey];
    const values: number[] = [];
    Object.keys(periodData).forEach(period => {
      const val = periodData[period][periodKey];
      if (typeof val === 'number') values.push(val);
    });
    const total = values.reduce((sum, v) => sum + v, 0);
    Object.keys(periodData).forEach(period => {
      const formattedPeriod = formatPeriodKey(period);
      const rawValue = periodData[period][periodKey];
      let value: string | number = '-';
      if (rawValue !== undefined && rawValue !== null) {
        value = rawValue;
        if (periodAsPercent && total > 0) {
          const percent = (rawValue / total) * 100;
          value = `${percent.toFixed(2)}%`;
        }
      }
      newItem[formattedPeriod] = value;
      if (!periodKeys.includes(formattedPeriod)) {
        periodKeys.push(formattedPeriod);
      }
    });
    return newItem;
  });
  return { formattedData, periodKeys };
};
