import qs from 'qs';

import type {
  THTTPParams,
  THTTPRequestConfig,
  TRequestInterceptor,
  TRequestParams,
  TResponseInterceptor,
} from './http.types';

export class HttpClient {
  private baseUrl: string;
  private requestInterceptors: TRequestInterceptor[] = [];
  private responseInterceptors: TResponseInterceptor[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  useRequestInterceptor(interceptor: TRequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  useResponseInterceptor(interceptor: TResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  private buildUrl(url: string, params?: THTTPParams): string {
    if (!params) return url;
    const query = qs.stringify(params);
    return url + (url.includes('?') ? '&' : '?') + query;
  }

  private async fetchRequest(
    url: string,
    init: RequestInit
  ): Promise<Response> {
    return await fetch(url, init);
  }

  async request<R>(
    method: string,
    url: string,
    body?: object,
    config: THTTPRequestConfig = {}
  ): Promise<R> {
    const { headers, params } = config;

    let requestParams: TRequestParams = {
      url,
      method,
      body,
      headers,
    };

    let fullUrl = this.baseUrl + this.buildUrl(requestParams.url, params);

    for (const interceptor of this.requestInterceptors) {
      const result = await interceptor(requestParams, fullUrl);
      requestParams = result[0];
      fullUrl = result[1];
    }

    const reqHeaders = new Headers({
      ...requestParams.headers,
    });

    const isFormData = requestParams.body instanceof FormData;

    const requestInit: RequestInit = {
      method: requestParams.method,
      headers: {},
    };

    if (requestParams.body) {
      requestInit.body = isFormData
        ? requestParams.body
        : JSON.stringify(requestParams.body);
    }

    const finalHeaders = {
      ...Object.fromEntries(reqHeaders.entries()),
    };

    if (!isFormData) {
      finalHeaders['Content-Type'] = 'application/json';
    }

    requestInit.headers = finalHeaders;
    requestInit.credentials = 'include';

    const retry = () => this.request<R>(method, url, body, config);

    const response = await this.fetchRequest(fullUrl, requestInit);

    if (!response.ok) {
      for (const interceptor of this.responseInterceptors) {
        const result = await interceptor(response, retry);
        if (result) return result as R;
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      throw {
        ...errorData,
        status: response.status,
        statusText: response.statusText,
      };
    }

    const finalResponse = (await response.json()) as R;

    for (const interceptor of this.responseInterceptors) {
      const result = await interceptor(response, retry);
      if (result) return result as R;
    }

    return finalResponse;
  }

  get<R = object>(url: string, config: THTTPRequestConfig = {}): Promise<R> {
    return this.request<R>('GET', url, undefined, config);
  }

  post<R = object>(
    url: string,
    body: object,
    config: THTTPRequestConfig = {}
  ): Promise<R> {
    return this.request<R>('POST', url, body, config);
  }

  patch<R = object>(
    url: string,
    body: object,
    config: THTTPRequestConfig = {}
  ): Promise<R> {
    return this.request<R>('PATCH', url, body, config);
  }

  delete<R = object>(
    url: string,
    body?: object,
    config: THTTPRequestConfig = {}
  ): Promise<R> {
    return this.request<R>('DELETE', url, body, config);
  }
}
