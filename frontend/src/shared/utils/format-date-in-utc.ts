export function formatDateInUTC(value?: string | null) {
  if (!value) return '';

  const date = new Date(value + 'Z');

  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Bishkek',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
