import type { ICreateEditModalProps } from '../components/create-edit-modal';

interface FieldsWithSelectItemsConfig {
  data: Record<string, string | number>[][];
  defaultData?: Record<string, string | number> | null;
  fields: ICreateEditModalProps['fields'];
  dependsUrls: { fieldName: string; url: string }[];
}

export const fieldsWithSelectItems = ({
  data,
  defaultData,
  fields,
  dependsUrls,
}: FieldsWithSelectItemsConfig) => {
  const processField = (field: any): any => {
    if (Array.isArray(field)) {
      return field.map(processField);
    }

    if (!field.name) return field;

    const defaultValue = defaultData?.[field.name];

    if (field.type !== 'select') {
      return { ...field, defaultValue };
    }

    const dependency = dependsUrls?.find(dep => dep.fieldName === field.name);

    if (!dependency) {
      return { ...field, selectItems: field.selectItems ?? [], defaultValue };
    }

    const urlIndex = dependsUrls?.findIndex(dep => dep.url === dependency.url);

    const selectItems =
      data?.[urlIndex]?.map(d => {
        const valueKey = field.selectValueKey ?? 'id';
        const labelKey = field.selectLabelKey;

        const value =
          (valueKey in d ? (d as any)[valueKey] : undefined) ?? d.id ?? d.name;
        const label =
          labelKey && labelKey in d
            ? String((d as any)[labelKey])
            : String(d.full_name ?? d.name ?? value);

        return {
          value,
          label,
        };
      }) || [];

    return { ...field, selectItems, defaultValue };
  };

  return fields.map(processField);
};
