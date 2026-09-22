import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { ApiClientConfig } from './client';

export class BaseResource {
  protected INSTANCE: AxiosInstance;

  constructor(config: ApiClientConfig) {
    const { baseURL } = config;
    if (!baseURL) throw new Error('BaseResource requires a baseURL');
    this.INSTANCE = axios.create({ baseURL });
  }

  protected async getRequestConfig(config?: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const token = 'BEARER_TOKEN';
    return { headers: { Authorization: `Bearer ${token}`, ...config?.headers }, ...config };
  }
}
