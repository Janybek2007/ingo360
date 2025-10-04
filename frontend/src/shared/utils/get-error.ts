import { ERROR_MESSAGES } from '../constants/errors';

type PydanticErrorDetail = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

type PydanticErrorResponse = {
  detail: PydanticErrorDetail[] | string;
};

export async function getError(error: Response): Promise<string> {
  try {
    const data = (await error.json()) as PydanticErrorResponse;

    // 🧩 Вариант 1: detail — массив pydantic-ошибок
    if (Array.isArray(data.detail)) {
      return data.detail
        .map(err => {
          const path = err.loc.join('.');
          return `${path}: ${err.msg}`;
        })
        .join('; ');
    }

    // 🧩 Вариант 2: detail — строка (код ошибки)
    if (typeof data.detail === 'string') {
      return ERROR_MESSAGES[data.detail] || data.detail;
    }

    // 🧩 fallback
    return 'Неизвестная ошибка';
  } catch {
    return 'Ошибка разбора ответа сервера';
  }
}
