# node-api-client-starter

A starter for building typed Node.js API clients on top of axios. It is not a
client for any specific API — it's the scaffolding you copy/extend to build
one.

## Design philosophy

The goal is: **wrap every call to a REST endpoint as a typed function call**,
so consumers of the finished client never construct a URL path by hand.

- `BaseResource` owns one axios instance scoped to a `baseURL` (+ an optional
  sub-`path`) and exposes protected `get/post/put/patch/delete` helpers that
  already carry auth headers. It's the extension point — subclass it when you
  need custom, non-CRUD methods.
- `CallerResource` is the ready-made generic resource: it turns those verbs
  into `list/retrieve/create/replace/modify/remove`, matching standard REST
  CRUD (collection GET/POST, item GET/PUT/PATCH/DELETE by id). Use it as-is
  for any endpoint that fits plain CRUD.
- `ApiClient` holds the top-level connection config (`baseURL`, `auth`) and
  exposes a `resource()` factory so a subclass can mount additional resources
  under sub-paths without repeating `baseURL`/`auth` wiring.

See `USAGE.md` for a full walkthrough.

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
