export type TRequestParams = {
  url: string;
  method: string;
  body?: object;
  headers?: HeadersInit;
};

export type THTTPParams = Record<string, string | number | boolean>;

export type THTTPRequestConfig<P = THTTPParams> = {
  headers?: HeadersInit;
  params?: P;
};

export type TRequestInterceptor = (
  config: TRequestParams,
  url: string
) => Promise<[TRequestParams, string]> | [TRequestParams, string];

export type TResponseInterceptor<R = object> = (
  response: Response,
  retry: () => Promise<R>
) => Promise<R | void>;
