export const stringToColor = (str: string): string => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = charCode + ((hash << 5) - hash) + i * 3;
    hash = hash & 0xffffffff;
  }

  const h = Math.abs(hash % 360);

  const s = 40 + (Math.abs(hash) % 20);

  const l = 50 + (Math.abs(hash >> 8) % 15);

  return `hsl(${h}, ${s}%, ${l}%)`;
};
