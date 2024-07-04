import { CallerResource } from './caller';

export type ApiClientConfig = { baseURL: string };

export type ResourceConfig = Partial<ApiClientConfig>;

export type ApiResponse<T = any> = { data: T; message: string; success: boolean };

export class ApiClient {
  public caller: CallerResource;

  constructor({ baseURL }: ApiClientConfig) {
    this.caller = new CallerResource({ baseURL });
  }

  private getBaseUrl(url: string, path: string) {
    return `${url}/${path}`;
  }
}
