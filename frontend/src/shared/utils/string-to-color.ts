/** Палитра контрастных цветов для графиков. Порядок: самые отличающиеся друг от друга первыми (чёрный, красный, жёлтый, синий…). */
export const DISTINCT_CHART_COLORS = [
  '#000000', // чёрный
  '#e32636', // красный
  '#f4c430', // жёлтый
  '#0047ab', // синий
  '#228b22', // зелёный
  '#ec7c26', // оранжевый
  '#53377a', // фиолетовый
  '#168980', // бирюзовый
  '#A45118', // шоколадный
  '#43FF43', // салатовый
  '#b3446c', // малиновый
  '#87cefa', // голубой
  '#e0b0ff', // сиреневый
  '#FB94B5', // розовый
  '#00541f', // тёмно-зелёный
  '#aaf0d1', // мятный
];

/** Цвет по индексу из палитры — без дубликатов, каждый индекс свой цвет. */
export function getDistinctColorByIndex(index: number): string {
  return DISTINCT_CHART_COLORS[index % DISTINCT_CHART_COLORS.length];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.codePointAt(i)! + ((hash << 5) - hash);
  }
  return hash;
}

/** Цвет из палитры по хешу строки (один текст — один цвет). Возможны коллизии; для линий без дубликатов используйте getDistinctColorByIndex. */
export function stringToDistinctColor(data: string | object): string {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  const index = Math.abs(hashString(str)) % DISTINCT_CHART_COLORS.length;
  return DISTINCT_CHART_COLORS[index];
}

export const stringToColor = (data: string | object): string => {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  const hash = hashString(str);

  const goldenAngle = 137.508;
  const h = Math.abs((hash * goldenAngle) % 360);
  const s = 70 + (Math.abs(hash) % 20);
  const l = 45 + (Math.abs(hash) % 15);

  return `hsl(${h}, ${s}%, ${l}%)`;
};
