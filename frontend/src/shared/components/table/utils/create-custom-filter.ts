import { getUniqueItems } from '#/shared/utils/get-unique-items';

export interface CustomFilterMapping {
  id: string;
  header: string;
  valueField: string;
  labelField: string;
}

export function createCustomFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[],
  selectedValues: Record<string, number[]>,
  fieldMappings: CustomFilterMapping[]
) {
  return fieldMappings.map(({ id, header, valueField, labelField }) => ({
    id,
    value: {
      colType: 'select' as const,
      header,
      selectValues: getUniqueItems(
        data
          .filter(
            item =>
              selectedValues[id]?.includes(item[valueField] as number) ?? false
          )
          .map(item => ({
            value: item[valueField],
            label: item[labelField],
          })),
        ['value']
      ),
    },
  }));
}
