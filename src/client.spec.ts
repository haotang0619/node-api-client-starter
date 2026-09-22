import axios, { AxiosInstance } from 'axios';

import { CallerResource } from './caller';
import { ApiClient, ApiClientConfig } from './client';

jest.mock('axios');

const mockedAxios = jest.mocked(axios);

class TestApiClient extends ApiClient {
  public items = this.resource(CallerResource, 'items');
}

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue({} as unknown as AxiosInstance);
  });

  it('creates the default `caller` resource at the client baseURL', () => {
    new ApiClient({ baseURL: 'https://api.example.com' });

    expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL: 'https://api.example.com' });
  });

  it('resource() mounts a resource scoped under baseURL + path', () => {
    new TestApiClient({ baseURL: 'https://api.example.com' });

    expect(mockedAxios.create).toHaveBeenNthCalledWith(2, {
      baseURL: 'https://api.example.com/items',
    });
  });

  it('resource() carries the client auth config down to the mounted resource', async () => {
    const instance = { get: jest.fn().mockResolvedValue({ data: [] }) };
    mockedAxios.create.mockReturnValue(instance as unknown as AxiosInstance);

    const config: ApiClientConfig = {
      auth: { token: 'tok', type: 'bearer' },
      baseURL: 'https://api.example.com',
    };
    const client = new TestApiClient(config);
    await client.items.list();

    expect(instance.get).toHaveBeenCalledWith('', { headers: { Authorization: 'Bearer tok' } });
  });
});
