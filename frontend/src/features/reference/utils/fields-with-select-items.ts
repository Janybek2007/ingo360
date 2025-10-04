/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ReferencesType,
  ReferencesTypeWithDepUrls,
  ReferencesTypeWithMain,
} from '#/shared/types/references.type';

import { referencesCEFields, referencesDependsUrls } from '../constants';

export const fieldsWithSelectItems = (
  type: ReferencesType,
  data: Record<string, string | number>[][],
  defaultData?: Record<string, string | number> | null
) => {
  const processField = (field: any): any => {
    if (Array.isArray(field)) {
      return field.map(processField);
    }

    if (!field.name) return field;

    const defaultValue = defaultData?.[field.name];

    if (field.type !== 'select') {
      return { ...field, defaultValue };
    }

    const dependency = referencesDependsUrls[
      type as ReferencesTypeWithDepUrls
    ]?.find(dep => dep.fieldName === field.name);

    if (!dependency) {
      return { ...field, selectItems: [], defaultValue };
    }

    const urlIndex = referencesDependsUrls[
      type as ReferencesTypeWithDepUrls
    ]?.findIndex(dep => dep.url === dependency.url);

    const selectItems =
      data?.[urlIndex]?.map(d => ({
        value: d.id,
        label: String(d.full_name ?? d.name),
      })) || [];

    return { ...field, selectItems, defaultValue };
  };

  return referencesCEFields[type as ReferencesTypeWithMain].map(processField);
};
