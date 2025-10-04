import type { ReferencesType } from '#/shared/types/references-type';

import { referencesCEFields, referencesDependsUrls } from '../constants';

export const fieldsWithSelectItems = (
  type: ReferencesType,
  data: Record<string, string | number>[][],
  defaultData?: Record<string, string | number> | null
) => {
  return referencesCEFields[type].map(field => {
    if (Array.isArray(field) || !field.name) return field;

    const defaultValue = defaultData?.[field.name];

    if (field.type !== 'select') {
      return { ...field, defaultValue };
    }

    const dependency = referencesDependsUrls[type].find(
      dep => dep.fieldName === field.name
    );

    if (!dependency) {
      return { ...field, selectItems: [], defaultValue };
    }

    const urlIndex = referencesDependsUrls[type].findIndex(
      dep => dep.url === dependency.url
    );

    const selectItems =
      data?.[urlIndex]?.map(d => ({
        value: d.id,
        label: String(d.name),
      })) || [];

    return { ...field, selectItems, defaultValue };
  });
};
