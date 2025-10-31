export function getUniqueItems<T extends Record<string, any>>(
  items: T[],
  keys: (keyof T)[]
): T[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = keys.map(k => String(item[k])).join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
