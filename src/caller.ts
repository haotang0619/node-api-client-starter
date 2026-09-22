import { AxiosRequestConfig } from 'axios';

import { BaseResource } from './base';

export class CallerResource extends BaseResource {
  public get instance() {
    return this.INSTANCE;
  }

  public create<T>(body: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.post<T>('', body, config);
  }

  public list<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.get<T>('', config);
  }

  public modify<T>(id: number | string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.patch<T>(`/${id}`, body, config);
  }

  public remove<T>(id: number | string, config?: AxiosRequestConfig): Promise<T> {
    return this.delete<T>(`/${id}`, config);
  }

  public replace<T>(id: number | string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.put<T>(`/${id}`, body, config);
  }

  public retrieve<T>(id: number | string, config?: AxiosRequestConfig): Promise<T> {
    return this.get<T>(`/${id}`, config);
  }
}
