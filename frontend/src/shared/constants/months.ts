export const Month = {
  JAN: 'Янв',
  FEB: 'Фев',
  MAR: 'Мар',
  APR: 'Апр',
  MAY: 'Май',
  JUN: 'Июн',
  JUL: 'Июл',
  AUG: 'Авг',
  SEP: 'Сен',
  OCT: 'Окт',
  NOV: 'Ноя',
  DEC: 'Дек',
} as const;

export const MonthFull = {
  JAN: 'Январь',
  FEB: 'Февраль',
  MAR: 'Март',
  APR: 'Апрель',
  MAY: 'Май',
  JUN: 'Июнь',
  JUL: 'Июль',
  AUG: 'Август',
  SEP: 'Сентябрь',
  OCT: 'Октябрь',
  NOV: 'Ноябрь',
  DEC: 'Декабрь',
} as const;

export const MonthNumber = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
} as const;

export const allMonths = [
  MonthFull.JAN,
  MonthFull.FEB,
  MonthFull.MAR,
  MonthFull.APR,
  MonthFull.MAY,
  MonthFull.JUN,
  MonthFull.JUL,
  MonthFull.AUG,
  MonthFull.SEP,
  MonthFull.OCT,
  MonthFull.NOV,
  MonthFull.DEC,
] as const;
