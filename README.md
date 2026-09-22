# node-api-client-starter

A starter for building typed Node.js API clients on top of axios. Use the
base `ApiClient` as-is for simple cases, or extend it to model a specific
API and publish the result as your own package (privately or on npm).

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

## Extending this starter

Modeling your own API — custom resources, custom method names, non-CRUD
actions — on top of this? See `USAGE.md` in this repo. It documents the
internals and extension patterns for whoever maintains this starter; it's
not published with the package (see `files` in `package.json`), and once
you've built a real client on top of it, replace this README with one that
documents _your_ client for _your_ users.

## Publishing

1. Update `CHANGELOG.md`
2. `npm version [patch|minor|major]`
3. `npm publish`

> To push tags to the remote repository, use `git push --tag`.

## Installation

> To test the package locally (without publishing it), run `npm install <path to node-api-client-starter>`.

## Conventional Commits

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Changes to UIUX or changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor` - A code change that neither fixes a bug nor adds a feature
- `perf` - A code change that improves performance
- `test` - Adding missing tests or correcting existing tests
- `build` — Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `ci` - Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- `chore` - Other changes that don't modify src or test files
- `revert` - Reverts a previous commit
