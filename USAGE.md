# Usage

## Quick start

```ts
import { ApiClient } from 'node-api-client-starter';

const client = new ApiClient({ baseURL: 'https://api.example.com' });

// `caller` is a default CallerResource scoped at the client's baseURL.
await client.caller.list();
await client.caller.retrieve(1);
await client.caller.create({ title: 'foo' });
```

`list/retrieve/create/replace/modify/remove` map to GET(collection)/GET(id)/POST/PUT/PATCH/DELETE.

## Auth

`ApiClientConfig.auth` is optional and one of three shapes; omit it for no
`Authorization` header at all.

```ts
new ApiClient({ baseURL, auth: { type: 'bearer', token: 'xxx' } }); // Authorization: Bearer xxx
new ApiClient({ baseURL, auth: { type: 'basic', token: 'base64…' } }); // Authorization: Basic base64…
new ApiClient({ baseURL, auth: { type: 'header', name: 'X-Api-Key', value: 'xxx' } }); // X-Api-Key: xxx
```

## Mounting a resource at a sub-path

Most real APIs have more than one collection under the same host
(`/users`, `/orders`, …). Extend `ApiClient` and mount one `CallerResource`
per path with the `resource()` factory — it forwards this client's
`baseURL`/`auth` so you don't repeat them:

```ts
import { ApiClient, CallerResource } from 'node-api-client-starter';

class MyApiClient extends ApiClient {
  public users = this.resource(CallerResource, 'users');
  public orders = this.resource(CallerResource, 'orders');
}

const client = new MyApiClient({
  baseURL: 'https://api.example.com',
  auth: { type: 'bearer', token: 'xxx' },
});

await client.users.retrieve(1); // GET https://api.example.com/users/1
await client.orders.list(); // GET https://api.example.com/orders
```

## Typing responses

`ApiResponse<T>` is an optional convenience type for APIs that wrap payloads
in a `{ data, message, success }` envelope — pass it as the generic when you
call a resource method:

```ts
import { ApiResponse } from 'node-api-client-starter';

type User = { id: number; name: string };

const res = await client.users.retrieve<ApiResponse<User>>(1);
res.data.name; // typed as string
```

If your API doesn't use that envelope, just pass your own type instead
(`client.users.retrieve<User>(1)`).

## Custom, non-CRUD endpoints

Not every endpoint is plain CRUD. Extend `BaseResource` directly and use its
protected `get/post/put/patch/delete` helpers (they already attach auth
headers) to write whatever method shape you need:

```ts
import { BaseResource } from 'node-api-client-starter';

class SearchResource extends BaseResource {
  search<T>(query: string) {
    return this.get<T>('', { params: { q: query } });
  }
}

class MyApiClient extends ApiClient {
  public search = this.resource(SearchResource, 'search');
}
```

For anything even a custom resource doesn't cover, every resource also
exposes `.instance`, the raw configured axios instance, as an escape hatch.

You can also extend `CallerResource` instead of `BaseResource` when a
resource is _mostly_ CRUD but needs one or two extra actions on top (e.g. a
state-change endpoint like `POST /orders/:id/cancel`):

```ts
class OrderResource extends CallerResource {
  cancel<T>(id: number | string) {
    return this.post<T>(`/${id}/cancel`);
  }
}

class MyApiClient extends ApiClient {
  public orders = this.resource(OrderResource, 'orders');
}

await client.orders.create({ item: 'foo' }); // inherited from CallerResource
await client.orders.cancel(1); // the extra action
```

## Flat vs. nested method names

`resource()` doesn't force a nested shape. Whether a resource ends up as
`client.orders.create(...)` or a flat `client.createOrder(...)` is just a
matter of whether you expose the resource as a public field or keep it
private and delegate to it from a named method:

```ts
class MyApiClient extends ApiClient {
  private orders = this.resource(OrderResource, 'orders'); // not public, so no client.orders.*

  createOrder<T>(body: unknown) {
    return this.orders.create<T>(body);
  }

  cancelOrder<T>(id: number | string) {
    return this.orders.cancel<T>(id);
  }
}

await client.createOrder({ item: 'foo' });
await client.cancelOrder(1);
```

Mix both freely in the same client — expose some resources as nested
properties, wrap others in flat, custom-named methods — whichever reads
better for the API you're modeling.

## Testing

`axios` is auto-mocked with `jest.mock('axios')`; `axios.create` is stubbed
to return a fake instance with `jest.fn()` methods, so no real HTTP call is
made. See `src/caller.spec.ts` and `src/client.spec.ts` for the pattern —
copy it for new resources.
