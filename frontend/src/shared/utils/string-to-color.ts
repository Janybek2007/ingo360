export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Генерируем насыщенные цвета (избегаем слишком темных и светлых)
  const h = Math.abs(hash % 360);
  const s = 65 + (Math.abs(hash) % 20); // 65-85% saturation
  const l = 45 + (Math.abs(hash >> 8) % 15); // 45-60% lightness

  return `hsl(${h}, ${s}%, ${l}%)`;
};
