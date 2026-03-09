export const stringToColor = (string_: string): string => {
  let hash = 0;

  for (let index = 0; index < string_.length; index++) {
    const charCode = string_.codePointAt(index)!;
    hash = charCode + ((hash << 5) - hash) + index * 3;
    hash = hash & 0xff_ff_ff_ff;
  }

  const h = Math.abs(hash % 360);
  const s = 70 + (Math.abs(hash) % 30);
  const l = 45 + (Math.abs(hash >> 8) % 15);

  return `hsl(${h}, ${s}%, ${l}%)`;
};
