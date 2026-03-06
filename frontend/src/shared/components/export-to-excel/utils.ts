import * as XLSX from 'xlsx';

import type { ExportToExcelProps as ExportToExcelProperties } from './export-to-excel.types';

export class ExcelExporter<T extends object> {
  private data: T[];
  private fileName: string;
  private formatHeader?: ExportToExcelProperties<T>['formatHeader'];
  private selectKeys: NonNullable<ExportToExcelProperties<T>['selectKeys']>;
  private periodKey?: string;
  private periodAsPercent: boolean;
  private transform?: (item: T) => any;
  private hasTotal: boolean;
  private emptyValue: string = '-';

  constructor(properties: ExportToExcelProperties<T>) {
    this.data = properties.data;
    this.fileName = properties.fileName || 'export';
    this.formatHeader = properties.formatHeader;
    this.selectKeys = properties.selectKeys || [];
    this.periodKey = properties.periodKey;
    this.periodAsPercent = properties.periodAsPercent || false;
    this.transform = properties.transform;
    this.hasTotal = properties.hasTotal || false;
  }

  private getNestedValue(object: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, object);
  }

  private isPeriodObject(value: any): boolean {
    if (!value || typeof value !== 'object') return false;
    return Object.keys(value).some(key => /^\d{4}-\d{2}$/.test(key));
  }

  private hasPeriods(data: any[]): boolean {
    if (!data || data.length === 0) return false;
    return Object.values(data[0]).some(value => this.isPeriodObject(value));
  }

  /**
   * Теперь формат периодов такой:
   *   ["2025-01", "2025-02", ...]
   */
  private getSelectedPeriods(): string[] {
    return this.selectKeys.filter(key =>
      /^\d{4}-\d{2}$/.test(String(key))
    ) as string[];
  }

  private flattenPeriodData(data: any[]): {
    formattedData: any[];
    periodKeys: string[];
  } {
    const selectedPeriods = this.getSelectedPeriods();
    const useAllPeriods = selectedPeriods.length === 0;

    const allPeriods = new Set<string>();

    for (const item of data) {
      const periodDataKey = Object.keys(item).find(key =>
        this.isPeriodObject(item[key])
      );
      if (!periodDataKey) continue;

      const periodData = item[periodDataKey];

      for (const period of Object.keys(periodData)) {
        if (useAllPeriods || selectedPeriods.includes(period)) {
          allPeriods.add(period);
        }
      }
    }

    const periodKeys = this.periodKeysSort([...allPeriods]);

    const formattedData = data.map(item => {
      const newItem: any = { ...item };

      const periodDataKey = Object.keys(item).find(key =>
        this.isPeriodObject(item[key])
      );

      if (!periodDataKey) return newItem;

      const periodData = item[periodDataKey];
      delete newItem[periodDataKey];

      let total = 0;

      for (const period of periodKeys) {
        const rawValue = periodData[period]?.[this.periodKey!];
        if (rawValue == null) continue;

        if (typeof rawValue === 'number') total += rawValue;
        newItem[period] = this.formatPeriodValue(rawValue);
      }

      if (this.hasTotal && total > 0) {
        newItem['total'] = this.periodAsPercent
          ? '100%'
          : Number(total.toFixed(2));
      }

      return newItem;
    });

    return { formattedData, periodKeys };
  }

  private periodKeysSort = (array: string[]) => {
    return array.toSorted((a, b) => {
      const [ay, am] = a.split('-').map(Number);
      const [by, bm] = b.split('-').map(Number);
      if (ay !== by) return ay - by;
      return am - bm;
    });
  };

  private formatData(data: any[], periodKeys: string[]): any[] {
    return data.map(item => {
      const newItem: any = {};

      const allowedTextKeys = this.selectKeys.filter(
        key => !/^\d{4}-\d{2}$/.test(String(key))
      );

      for (const key of allowedTextKeys) {
        const keyString = String(key);
        let value = this.getNestedValue(item, keyString);
        value = value === undefined || value === null ? this.emptyValue : value;

        const headerName =
          this.formatHeader?.[keyString as keyof typeof this.formatHeader] ||
          keyString;

        newItem[headerName] = value;
      }

      for (const period of periodKeys) {
        newItem[period] =
          item[period] !== undefined && item[period] !== null
            ? item[period]
            : this.emptyValue;
      }

      if (this.hasTotal && 'total' in item) {
        newItem['Итого'] = item.total;
      }

      return newItem;
    });
  }

  private formatPeriodValue(rawValue: number | string): string {
    if (this.periodAsPercent) {
      return `${Math.trunc(Number(rawValue))}%`;
    }
    if (typeof rawValue === 'number') {
      return rawValue.toFixed(2);
    }
    return rawValue;
  }

  public export(): void {
    if (!this.data || this.data.length === 0) {
      console.warn('Нет данных для экспорта');
      return;
    }

    let formattedData = this.transform
      ? this.data.map(item => this.transform!(item))
      : this.data;

    let periodKeys: string[] = [];

    if (this.periodKey && this.hasPeriods(formattedData)) {
      const result = this.flattenPeriodData(formattedData);
      formattedData = result.formattedData;
      periodKeys = result.periodKeys;
    }

    const finalData = this.formatData(formattedData, periodKeys);

    const headers = Object.keys(finalData[0] || {});

    const dataArray = [
      headers,
      ...finalData.map(item =>
        headers.map(header => {
          const v = item[header];
          return v === undefined || v === null ? this.emptyValue : v;
        })
      ),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${this.fileName}.xlsx`);
  }
}
