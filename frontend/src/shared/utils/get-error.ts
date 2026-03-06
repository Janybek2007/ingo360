import { ERROR_MESSAGES } from '../constants/errors';

type ErrorDetail = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

type ErrorResponse = {
  detail: ErrorDetail[] | string;
};

export async function getResponseError(error?: Response): Promise<string> {
  if (!error) {
    return 'Неизвестная ошибка';
  }

  let parsed: unknown = null;
  try {
    parsed = await error.clone().json();
  } catch {
    parsed = null;
  }

  if (parsed && typeof parsed === 'object') {
    const data = parsed as ErrorResponse;
    if (Array.isArray(data.detail)) {
      return data.detail
        .map(error_ => {
          const path = error_.loc.join('.');
          return `${path}: ${error_.msg}`;
        })
        .join('; ');
    }

    if (typeof data.detail === 'string') {
      return ERROR_MESSAGES[data.detail] || data.detail;
    }
  }

  const rawText = await error.text().catch(() => '');
  if (!rawText) {
    return 'Неизвестная ошибка';
  }

  return ERROR_MESSAGES[rawText] || rawText;
}
