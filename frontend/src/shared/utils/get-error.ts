import { ERROR_MESSAGES } from '../constants/errors';

type ErrorDetail = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

type ErrorResponse = {
  detail: ErrorDetail[] | string;
};

export async function getResponseError(error: Response): Promise<string> {
  try {
    const data = (await error.json()) as ErrorResponse;

    if (Array.isArray(data.detail)) {
      return data.detail
        .map(err => {
          const path = err.loc.join('.');
          return `${path}: ${err.msg}`;
        })
        .join('; ');
    }

    if (typeof data.detail === 'string') {
      return ERROR_MESSAGES[data.detail] || data.detail;
    }

    return 'Неизвестная ошибка';
  } catch {
    return 'Ошибка разбора ответа сервера';
  }
}
