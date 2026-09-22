import axios, { AxiosInstance } from 'axios';

import { CallerResource } from './caller';

jest.mock('axios');

const mockedAxios = jest.mocked(axios);

describe('CallerResource', () => {
  const instance = {
    delete: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(instance as unknown as AxiosInstance);
  });

  it('throws when baseURL is missing', () => {
    expect(() => new CallerResource({ baseURL: '' })).toThrow('BaseResource requires a baseURL');
  });

  it('joins baseURL and path when scoped to a resource', () => {
    new CallerResource({ baseURL: 'https://api.example.com/' }, 'todos');

    expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL: 'https://api.example.com/todos' });
  });

  it('list() GETs the collection and unwraps response data', async () => {
    instance.get.mockResolvedValue({ data: [{ id: 1 }] });
    const caller = new CallerResource({ baseURL: 'https://api.example.com' });

    await expect(caller.list()).resolves.toEqual([{ id: 1 }]);
    expect(instance.get).toHaveBeenCalledWith('', { headers: {} });
  });

  it('retrieve(id) GETs the item path', async () => {
    instance.get.mockResolvedValue({ data: { id: 1 } });
    const caller = new CallerResource({ baseURL: 'https://api.example.com' });

    await caller.retrieve(1);

    expect(instance.get).toHaveBeenCalledWith('/1', { headers: {} });
  });

  it('create() POSTs the body to the collection path', async () => {
    instance.post.mockResolvedValue({ data: { id: 1 } });
    const caller = new CallerResource({ baseURL: 'https://api.example.com' });

    await caller.create({ title: 'foo' });

    expect(instance.post).toHaveBeenCalledWith('', { title: 'foo' }, { headers: {} });
  });

  it('replace()/modify()/remove() hit PUT/PATCH/DELETE on the item path', async () => {
    instance.put.mockResolvedValue({ data: {} });
    instance.patch.mockResolvedValue({ data: {} });
    instance.delete.mockResolvedValue({ data: {} });
    const caller = new CallerResource({ baseURL: 'https://api.example.com' });

    await caller.replace(1, { title: 'foo' });
    await caller.modify(1, { title: 'bar' });
    await caller.remove(1);

    expect(instance.put).toHaveBeenCalledWith('/1', { title: 'foo' }, { headers: {} });
    expect(instance.patch).toHaveBeenCalledWith('/1', { title: 'bar' }, { headers: {} });
    expect(instance.delete).toHaveBeenCalledWith('/1', { headers: {} });
  });

  it('attaches a Bearer Authorization header for bearer auth', async () => {
    instance.get.mockResolvedValue({ data: [] });
    const caller = new CallerResource({
      auth: { token: 'tok', type: 'bearer' },
      baseURL: 'https://api.example.com',
    });

    await caller.list();

    expect(instance.get).toHaveBeenCalledWith('', { headers: { Authorization: 'Bearer tok' } });
  });

  it('attaches a Basic Authorization header for basic auth', async () => {
    instance.get.mockResolvedValue({ data: [] });
    const caller = new CallerResource({
      auth: { token: 'dXNlcjpwYXNz', type: 'basic' },
      baseURL: 'https://api.example.com',
    });

    await caller.list();

    expect(instance.get).toHaveBeenCalledWith('', {
      headers: { Authorization: 'Basic dXNlcjpwYXNz' },
    });
  });

  it('attaches a custom header for header auth', async () => {
    instance.get.mockResolvedValue({ data: [] });
    const caller = new CallerResource({
      auth: { name: 'X-Api-Key', type: 'header', value: 'key-abc' },
      baseURL: 'https://api.example.com',
    });

    await caller.list();

    expect(instance.get).toHaveBeenCalledWith('', { headers: { 'X-Api-Key': 'key-abc' } });
  });

  it('sends no Authorization header when auth is not configured', async () => {
    instance.get.mockResolvedValue({ data: [] });
    const caller = new CallerResource({ baseURL: 'https://api.example.com' });

    await caller.list();

    expect(instance.get).toHaveBeenCalledWith('', { headers: {} });
  });
});
