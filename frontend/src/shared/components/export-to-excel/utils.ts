import * as XLSX from 'xlsx';

import type { ExportToExcelProps } from './export-to-excel.types';

export class ExcelExporter<T extends object> {
  private data: T[];
  private fileName: string;
  private formatHeader?: ExportToExcelProps<T>['formatHeader'];
  private selectKeys: NonNullable<ExportToExcelProps<T>['selectKeys']>;
  private periodKey?: string;
  private periodAsPercent: boolean;
  private transform?: (item: T) => any;
  private hasTotal: boolean;
  private emptyValue: string = '-';

  constructor(props: ExportToExcelProps<T>) {
    this.data = props.data;
    this.fileName = props.fileName || 'export';
    this.formatHeader = props.formatHeader;
    this.selectKeys = props.selectKeys || [];
    this.periodKey = props.periodKey;
    this.periodAsPercent = props.periodAsPercent || false;
    this.transform = props.transform;
    this.hasTotal = props.hasTotal || false;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
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

    data.forEach(item => {
      const periodDataKey = Object.keys(item).find(key =>
        this.isPeriodObject(item[key])
      );
      if (!periodDataKey) return;

      const periodData = item[periodDataKey];

      Object.keys(periodData).forEach(period => {
        if (useAllPeriods || selectedPeriods.includes(period)) {
          allPeriods.add(period);
        }
      });
    });

    const periodKeys = this.periodKeysSort(Array.from(allPeriods));

    const formattedData = data.map(item => {
      const newItem: any = { ...item };

      const periodDataKey = Object.keys(item).find(key =>
        this.isPeriodObject(item[key])
      );

      if (!periodDataKey) return newItem;

      const periodData = item[periodDataKey];
      delete newItem[periodDataKey];

      let total = 0;

      periodKeys.forEach(period => {
        const rawValue = periodData[period]?.[this.periodKey!];

        if (rawValue !== undefined && rawValue !== null) {
          if (typeof rawValue === 'number') {
            total += rawValue;
          }

          let value: string | number = rawValue;

          if (this.periodAsPercent) {
            value = `${Math.trunc(rawValue)}%`;
          } else if (typeof rawValue === 'number') {
            value = Number(rawValue.toFixed(2));
          }

          newItem[period] = value;
        }
      });

      if (this.hasTotal && total > 0) {
        newItem['total'] = this.periodAsPercent
          ? '100%'
          : Number(total.toFixed(2));
      }

      return newItem;
    });

    return { formattedData, periodKeys };
  }

  private periodKeysSort = (arr: string[]) => {
    return [...arr].sort((a, b) => {
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

      allowedTextKeys.forEach(key => {
        const keyStr = String(key);
        let value = this.getNestedValue(item, keyStr);
        value = value === undefined || value === null ? this.emptyValue : value;

        const headerName =
          this.formatHeader?.[keyStr as keyof typeof this.formatHeader] ||
          keyStr;

        newItem[headerName] = value;
      });

      periodKeys.forEach(period => {
        newItem[period] =
          item[period] !== undefined && item[period] !== null
            ? item[period]
            : this.emptyValue;
      });

      if (this.hasTotal && 'total' in item) {
        newItem['Итого'] = item.total;
      }

      return newItem;
    });
  }

  public export(): void {
    if (!this.data || this.data.length === 0) {
      console.warn('Нет данных для экспорта');
      return;
    }

    let formattedData = this.transform
      ? this.data.map(this.transform)
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
