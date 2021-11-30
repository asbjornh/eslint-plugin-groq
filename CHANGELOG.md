## 2.0.0

- Adds `groqs` option to `no-syntax-errors` and `no-template-expressions` rules to support a growing number of `groq` proxies
- **BREAKING CHANGE**: Drops explicit support for `@nuxtjs/sanity`. Users of `@nuxtjs/sanity` must now configure this per rule instead:

```json
{
  "@asbjorn/groq/no-syntax-errors": ["error", { "groqs": ["@nuxtjs/sanity"] }],
  "@asbjorn/groq/no-template-expressions": [
    "error",
    { "groqs": ["@nuxtjs/sanity"] }
  ]
}
```

## 1.0.0

- **BREAKING CHANGE**: Set minimum Node version to 10.0.0
- Adds support for linting `groq` exported by `@nuxtjs/sanity`

## 0.1.2

- Fixes wrong plugin name in recommended config

## 0.1.1

- Fixes error being reported at wrong location in cases where `groq-js` doesn't report a position.
