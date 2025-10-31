import { getUniqueItems } from '#/shared/utils/get-unique-items';

export interface CustomFilterMapping {
  id: string;
  header: string;
  labelField: string;
}

export function createCustomFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[],
  selectedValues: Record<string, number[]>,
  fieldMappings: CustomFilterMapping[]
) {
  return fieldMappings.map(({ id, header, labelField }) => ({
    id,
    value: {
      colType: 'select' as const,
      header,
      selectValues: getUniqueItems(
        data
          .filter(
            item => selectedValues[id]?.includes(item[id] as number) ?? false
          )
          .map(item => ({
            value: item[id],
            label: item[labelField],
          })),
        ['value']
      ),
    },
  }));
}
