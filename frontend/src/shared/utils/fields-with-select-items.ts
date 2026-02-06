import type { ICreateEditModalProps } from '../components/create-edit-modal';

interface FieldsWithSelectItemsConfig {
  data?: Record<string, string | number>[][];
  options?: Record<string, Array<{ value: string | number; label: string }>>;
  defaultData?: Record<string, string | number> | null;
  fields: ICreateEditModalProps['fields'];
  dependsUrls: { fieldName: string; url: string }[];
}

type TDependencyItem = Record<string, string | number> & {
  id?: string | number;
  name?: string;
  full_name?: string;
};

export const fieldsWithSelectItems = ({
  data,
  options,
  defaultData,
  fields,
  dependsUrls,
}: FieldsWithSelectItemsConfig) => {
  const getDependencyData = (dependencyUrl: string, urlIndex: number) => {
    if (options) {
      const key =
        dependencyUrl === 'companies'
          ? 'companies_companies'
          : dependencyUrl.replace(/[/-]/g, '_');

      return (options[key] || [])
        .filter(option => option.value !== 0)
        .map(option => ({
          id: option.value,
          name: option.label,
          value: option.value,
          label: option.label,
        }));
    }

    return data?.[urlIndex] || [];
  };

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
    const dependencyData = getDependencyData(dependency.url, urlIndex);

    const selectItems = (dependencyData as TDependencyItem[]).map(d => {
      const valueKey = field.selectValueKey ?? 'id';
      const labelKey = field.selectLabelKey;

      const value =
        (valueKey in d ? (d as any)[valueKey] : undefined) ?? d.id ?? d.name;
      const label =
        labelKey && labelKey in d
          ? String((d as any)[labelKey])
          : String(d.name ?? d.full_name ?? value);

      return {
        value,
        label,
      };
    });

    return { ...field, selectItems, defaultValue };
  };

  return fields.map(processField);
};
