# @asbjorn/eslint-plugin-groq

Unofficial `eslint` plugin for [GROQ](https://www.sanity.io/docs/groq) queries.

```
npm install @asbjorn/eslint-plugin-groq
```

## Requirements

This plugin uses [`groq`](https://www.npmjs.com/package/groq) to identify GROQ tagged template literals, and by default will not report anything for queries that don't use this package.

If you use `groq` from a different library, such as `@nuxtjs/sanity` or `next-sanity`, see below for configuration.

```js
// Will not be linted:
const query = "*[_type == 'movies'][0..10]";

// Will be linted:
import groq from "groq";
const query = groq`*[_type == 'movies'][0..10]`;

// Will also be linted:
import anything from "groq";
const query = anything`*[_type == 'movies'][0..10]`;
```

## Configuration

```json
{
  "plugins": ["@asbjorn/groq"],
  "rules": {
    "@asbjorn/groq/no-syntax-errors": "error",
    "@asbjorn/groq/no-template-expressions": "error"
  }
}
```

Or:

```json
{
  "extends": ["plugin:@asbjorn/groq/recommended"]
}
```

### Using `groq` from other libraries

By default these eslint rules only check queries using the GROQ function exported from the `groq` npm package. If you use GROQ from a different library, such as `@nuxtjs/sanity` or `next-sanity`, you can pass an array of package names as config to the rules:

```json
{
  "plugins": ["@asbjorn/groq"],
  "rules": {
    "@asbjorn/groq/no-syntax-errors": [
      "error",
      { "groqs": ["@nuxtjs/sanity"] }
    ],
    "@asbjorn/groq/no-template-expressions": [
      "error",
      { "groqs": ["@nuxtjs/sanity"] }
    ]
  }
}
```

## Rules

### no-syntax-errors

Reports any syntax errors in GROQ queries tagged with the function exported from `groq`. Note that template literals that contain expressions will not be linted because resolving the expressions is very hard to do reliably. If you want to be extra safe, use this rule in combination with the `no-template-expressions` rule.

#### Failing cases

```js
// Syntax error in tagged query
import groq from "groq";
groq`*[_type == { ]`;

// Syntax error (not imported as `groq`)
import hello from "groq";
hello`*[_type == { ]`;
```

#### Passing cases

```js
// Non-tagged query with syntax error
`*[_type == {]`;

// Valid, tagged query
import groq from "groq";
groq`*[_type == 'movie']`;

// Query with syntax error tagged with `groq` not imported from `"groq"`
import groq from "somewhere";
groq`*[_type == {]`;

// Query with syntax error and template expression
import groq from "groq";
groq`*[_${expression} == {]`;
```

### no-template-expressions

Reports any expressions in GROQ queries tagged with the function exported from `groq`. This rule exists because the `no-syntax-errors` rule bails on any query that contains expressions (see the description for that rule).

#### Failing cases

```js
// Template expression
import groq from "groq";
groq`*[_type == ${type}]`;

// Template expression (not imported as 'groq')
import hello from "groq";
hello`*[_type == ${type}]`;
```

#### Passing cases

```js
// Tagged query without expressions
import groq from "groq";
groq`*[_type == 'movie']`;

// Non-tagged query with expression
`*[_type == ${type}]`;

// Query with expression tagged with `groq` not imported from `"groq"`
import groq from "somewhere";
groq`*[_type == ${type}]`;
```
