import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { ResourceConfig } from './client';

export class BaseResource {
  protected INSTANCE: AxiosInstance;

  constructor(config: ResourceConfig) {
    const { baseURL } = config;
    if (!!baseURL) this.INSTANCE = axios.create({ baseURL });
  }

  protected async getRequestConfig(config?: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const token = 'BEARER_TOKEN';
    return { headers: { Authorization: `Bearer ${token}`, ...config?.headers }, ...config };
  }
}
