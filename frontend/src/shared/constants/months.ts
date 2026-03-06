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
