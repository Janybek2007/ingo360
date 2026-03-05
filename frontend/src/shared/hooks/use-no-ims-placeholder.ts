import type { HTTPError } from 'ky';
import { useMemo } from 'react';

const IMS_REPORTS_TOP = 'ims/reports/top';

function hasResponse(
  err: unknown
): err is HTTPError & { response: { status: number } } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as { response?: { status?: number } }).response?.status ===
      'number'
  );
}

/** Проверка по тексту ошибки (обёрнутые ошибки без .response) */
function is404ImsReportsTopError(err: unknown): boolean {
  const msg =
    (err as Error)?.message ??
    (err as { cause?: Error })?.cause?.message ??
    String(err);
  if (typeof msg !== 'string') return false;
  if (msg.includes('У компании нет IMS')) return true;
  const has404 = msg.includes('404');
  const hasReportsTop =
    msg.includes(IMS_REPORTS_TOP) || msg.includes('reports/top');
  return has404 && hasReportsTop;
}

/** Проверка по URL запроса (ky HTTPError имеет request) */
function isImsReportsTopRequest(err: unknown): boolean {
  const req = (err as { request?: Request }).request;
  const url = req?.url ?? '';
  return url.includes(IMS_REPORTS_TOP);
}

/**
 * Определяет, является ли ошибка запроса 404 для ims/reports/top
 * (нет IMS названия и брендов у компании). Показываем заглушку вместо ошибки.
 * Работает синхронно, чтобы не было мигания красного экрана.
 */
export function useNoImsPlaceholder(queryError: unknown): boolean {
  return useMemo(() => {
    if (!queryError) return false;
    if (is404ImsReportsTopError(queryError)) return true;
    if (
      hasResponse(queryError) &&
      queryError.response.status === 404 &&
      isImsReportsTopRequest(queryError)
    ) {
      return true;
    }
    return false;
  }, [queryError]);
}
