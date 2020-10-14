# @asbjorn/eslint-plugin-groq

Unofficial `eslint` plugin for [GROQ](https://www.sanity.io/docs/groq) queries.

```
npm install groq @asbjorn/eslint-plugin-groq
```

## Requirements

Only supports linting GROQ tagged template literals using these packages:

* [`groq`](https://www.npmjs.com/package/groq)
* [`@nuxtjs/sanity`](https://www.npmjs.com/package/@nuxtjs/sanity)

Other GROQ imports will not be linted.

```js
// Will not be linted:
const query = "*[_type == 'movies'][0..10]";

// Will be linted:
import groq from "groq";
const query = groq`*[_type == 'movies'][0..10]`;

// Will also be linted:
import anything from "groq";
const query = anything`*[_type == 'movies'][0..10]`;

// Will also be linted:
import { groq } from "@nuxtjs/sanity";
const query = groq`*[_type == 'movies'][0..10]`;

// Will also be linted:
import { groq as anything } from "@nuxtjs/sanity";
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
