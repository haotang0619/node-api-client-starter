import { BaseResource } from './base';
import { CallerResource } from './caller';

export type ApiClientConfig = { auth?: AuthConfig; baseURL: string };

// `any` default so ApiResponse can be used as a plain envelope type before the payload shape is known.
export type ApiResponse<T = any> = { data: T; message: string; success: boolean };

export type AuthConfig =
  | { name: string; type: 'header'; value: string }
  | { token: string; type: 'basic' }
  | { token: string; type: 'bearer' };

export class ApiClient {
  public caller: CallerResource;

  constructor(private readonly config: ApiClientConfig) {
    this.caller = new CallerResource(config);
  }

  // Mounts a BaseResource subclass scoped under this client's baseURL + path, inheriting auth.
  protected resource<T extends BaseResource>(
    Resource: new (config: ApiClientConfig, path?: string) => T,
    path: string,
  ): T {
    return new Resource(this.config, path);
  }
}
