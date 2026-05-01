import type { CColumn } from '#/shared/hooks/use-generate-columns';

// ---- Parsing ----
type Period =
  | { type: 'month'; year: number; order: number }
  | { type: 'quarter'; year: number; order: number }
  | { type: 'year'; year: number; order: number }
  | { type: 'unknown'; year: 0; order: 0 };

class MarketInsightsDynamicPeriods {
  private staticKeys = [
    'company',
    'brand',
    'segment',
    'dosage_form',
    'dosage',
    'molecule',
  ];

  // ---- Parsing ----
  private parsePeriod(key: string): Period {
    if (/^\d{4}-\d{2}$/.test(key)) {
      const [year, month] = key.split('-').map(Number);
      return { type: 'month', year, order: month };
    }
    if (/^\d{4}-Q\d$/.test(key)) {
      const [yearPart, quarterPart] = key.split('-Q');
      return {
        type: 'quarter',
        year: Number(yearPart),
        order: Number(quarterPart),
      };
    }
    if (/^\d{4}$/.test(key)) {
      return { type: 'year', year: Number(key), order: 1 };
    }
    return { type: 'unknown', year: 0, order: 0 };
  }

  // ---- Format Header ----
  private formatHeader(key: string): string {
    const p = this.parsePeriod(key);
    switch (p.type) {
      case 'month': {
        return `${p.year}-${String(p.order).padStart(2, '0')}`;
      }
      case 'quarter': {
        return `${p.year}-Q${p.order}`;
      }
      case 'year': {
        return `${p.year}`;
      }
      default: {
        return key;
      }
    }
  }

  // ---- Sorting ----
  private sortPeriods(a: string, b: string): number {
    const pa = this.parsePeriod(a);
    const pb = this.parsePeriod(b);

    if (pa.year !== pb.year) return pa.year - pb.year;
    return pa.order - pb.order;
  }

  // ---- Generate Columns ----
  public generate = (data: any[]): CColumn<any>[] => {
    if (!data || data.length === 0) return [];

    const firstRow = data[0];

    const periodKeys = Object.keys(firstRow)
      .filter(key => !this.staticKeys.includes(key))
      .toSorted((a, b) => this.sortPeriods(a, b));

    return periodKeys.map(key => ({
      id: key,
      key,
      header: this.formatHeader(key),
      aggregate: 'sum' as const,
      type: 'number',
      custom: {
        cell: ({ row }: any) => {
          const value = row.original[key];
          return typeof value === 'number'
            ? value.toLocaleString('ru-RU', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : value;
        },
      },
    }));
  };
}

export const marketInsightsDynamicPeriods =
  new MarketInsightsDynamicPeriods().generate.bind(
    MarketInsightsDynamicPeriods
  );
