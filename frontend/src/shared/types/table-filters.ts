export type TableFilterSelectValue = {
  selectValues: { label: string; value: string | number }[];
  colType: 'select' | 'string' | 'number';
  header: string;
};

export type TableFilterStringValue = {
  type: 'contains' | 'startsWith' | 'equals' | 'doesNotEqual';
  value: string;
  colType: 'string';
  header: string;
};

export type TableFilterNumberValue =
  | { type: '>'; value: number; colType: 'number'; header: string }
  | { type: '>='; value: number; colType: 'number'; header: string }
  | { type: '<'; value: number; colType: 'number'; header: string }
  | { type: '<='; value: number; colType: 'number'; header: string }
  | { type: '='; value: number; colType: 'number'; header: string }
  | {
      type: 'between';
      value: [number, number];
      colType: 'number';
      header: string;
    };

export type TableFilterValue =
  | TableFilterSelectValue
  | TableFilterStringValue
  | TableFilterNumberValue;
