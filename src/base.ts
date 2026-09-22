import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { ApiClientConfig, AuthConfig } from './client';

export class BaseResource {
  protected INSTANCE: AxiosInstance;

  private readonly auth?: AuthConfig;

  constructor(config: ApiClientConfig, path?: string) {
    const { auth, baseURL } = config;
    if (!baseURL) throw new Error('BaseResource requires a baseURL');
    this.INSTANCE = axios.create({ baseURL: joinUrl(baseURL, path) });
    this.auth = auth;
  }

  protected async delete<T>(path = '', config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.INSTANCE.delete<T>(path, this.getRequestConfig(config));
    return data;
  }

  protected async get<T>(path = '', config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.INSTANCE.get<T>(path, this.getRequestConfig(config));
    return data;
  }

  protected getRequestConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
    return { ...config, headers: { ...this.getAuthHeader(), ...config?.headers } };
  }

  protected async patch<T>(path = '', body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.INSTANCE.patch<T>(path, body, this.getRequestConfig(config));
    return data;
  }

  protected async post<T>(path = '', body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.INSTANCE.post<T>(path, body, this.getRequestConfig(config));
    return data;
  }

  protected async put<T>(path = '', body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.INSTANCE.put<T>(path, body, this.getRequestConfig(config));
    return data;
  }

  private getAuthHeader(): Record<string, string> {
    if (!this.auth) return {};
    switch (this.auth.type) {
      case 'basic':
        return { Authorization: `Basic ${this.auth.token}` };
      case 'bearer':
        return { Authorization: `Bearer ${this.auth.token}` };
      case 'header':
        return { [this.auth.name]: this.auth.value };
    }
  }
}

function joinUrl(baseURL: string, path?: string): string {
  if (!path) return baseURL;
  return `${baseURL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
