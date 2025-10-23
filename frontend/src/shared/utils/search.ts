const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

const searchInText = (text: string, search: string): boolean => {
  if (!search) return true;
  if (!text) return false;
  return normalizeText(text).includes(normalizeText(search));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const searchInFields = <T extends Record<string, any>>(
  item: T,
  search: string,
  fields: (keyof T)[]
): boolean => {
  if (!search) return true;

  return fields.some(field => {
    const value = item[field];

    if (value === null || value === undefined) return false;

    if (typeof value === 'string') {
      return searchInText(value, search);
    }

    if (typeof value === 'number') {
      return String(value).includes(search);
    }

    if (typeof value === 'object') {
      if ('label' in value && typeof value.label === 'string') {
        return searchInText(value.label, search);
      }
      if ('value' in value) {
        const objValue = value.value;
        if (typeof objValue === 'string') {
          return searchInText(objValue, search);
        }
        if (typeof objValue === 'number') {
          return String(objValue).includes(search);
        }
      }
    }

    return false;
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterBySearch = <T extends Record<string, any>>(
  items: T[],
  search: string,
  fields: (keyof T)[]
): T[] => {
  if (!search) return items;
  return items.filter(item => searchInFields(item, search, fields));
};
