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
  private noFraction: boolean;

  constructor(props: ExportToExcelProps<T>) {
    this.data = props.data;
    this.fileName = props.fileName || 'export';
    this.formatHeader = props.formatHeader;
    this.selectKeys = props.selectKeys || [];
    this.periodKey = props.periodKey;
    this.periodAsPercent = props.periodAsPercent || false;
    this.transform = props.transform;
    this.hasTotal = props.hasTotal || false;
    this.noFraction = props.noFraction || false;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      current[key] = current[key] || {};
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
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

    // собираем периоды
    data.forEach(item => {
      const periodDataKey = Object.keys(item).find(key =>
        this.isPeriodObject(item[key])
      );
      if (!periodDataKey) return;

      const periodData = item[periodDataKey];

      Object.keys(periodData).forEach(period => {
        if (useAllPeriods) {
          allPeriods.add(period); // уже YYYY-MM
        } else if (selectedPeriods.includes(period)) {
          allPeriods.add(period);
        }
      });
    });

    const periodKeys = Array.from(allPeriods);

    const formattedData = data.map(item => {
      const newItem: any = { ...item };

      const periodDataKey = Object.keys(item).find(key =>
        this.isPeriodObject(item[key])
      );

      if (!periodDataKey) return newItem;

      const periodData = item[periodDataKey];
      delete newItem[periodDataKey];

      let total = 0;

      // считаем total
      periodKeys.forEach(period => {
        const val = periodData[period]?.[this.periodKey!];
        if (typeof val === 'number') total += val;
      });

      // формируем значения
      periodKeys.forEach(period => {
        const rawValue = periodData[period]?.[this.periodKey!];

        let value: string | number = '-';

        if (rawValue !== undefined && rawValue !== null) {
          value = rawValue;

          if (this.periodAsPercent && total > 0) {
            let percent = (rawValue / total) * 100;
            if (this.noFraction) {
              percent = Math.round(percent);
            } else {
              percent = +percent.toFixed(2);
            }
            value = `${percent}%`;
          } else if (this.noFraction && typeof value === 'number') {
            value = Math.round(value);
          }
        }

        newItem[period] = value;
      });

      if (this.hasTotal) {
        newItem['total'] = total;
      }

      return newItem;
    });

    return { formattedData, periodKeys };
  }

  private formatData(data: any[], periodKeys: string[]): any[] {
    return data.map(item => {
      const newItem: any = {};

      const textKeys = Object.keys(item).filter(
        key =>
          !periodKeys.includes(key) && key !== 'total' && !key.endsWith('_id')
      );
      const totalKey = this.hasTotal && 'total' in item ? ['total'] : [];
      // порядок:
      // текстовые колонки → периоды → total (если есть)
      const keysToExport = [...textKeys, ...periodKeys, ...totalKey];

      keysToExport.forEach(key => {
        const keyStr = String(key);

        let value = periodKeys.includes(keyStr)
          ? item[keyStr]
          : this.getNestedValue(item, keyStr);

        value = value === undefined || value === null ? '-' : value;

        const newKey =
          this.formatHeader?.[
            keyStr as keyof ExportToExcelProps<T>['formatHeader']
          ] || keyStr;

        this.setNestedValue(newItem, newKey, value);
      });

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
      ...finalData.map(item => headers.map(header => item[header])),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${this.fileName}.xlsx`);
  }
}
