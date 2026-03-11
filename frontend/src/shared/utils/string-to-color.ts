export const stringToColor = (data: string | object): string => {
  const str = typeof data === 'string' ? data : JSON.stringify(data);

  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.codePointAt(i)! + ((hash << 5) - hash);
  }

  const goldenAngle = 137.508;

  const h = Math.abs((hash * goldenAngle) % 360);
  const s = 70 + (Math.abs(hash) % 20);
  const l = 45 + (Math.abs(hash) % 15);

  return `hsl(${h}, ${s}%, ${l}%)`;
};
