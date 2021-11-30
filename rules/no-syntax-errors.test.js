const test = require("ava");
const RuleTester = require("eslint-ava-rule-tester");
const path = require("path");

const plugin = require("../index");

const ruleTester = new RuleTester(test, {
  parser: path.resolve(__dirname, "../node_modules/babel-eslint/lib/index.js"),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
});

const validCases = [
  // If this case fails something is very wrong
  [""],

  // Non-tagged query with syntax error
  ["`*[_type == {]`"],

  // Valid query
  ["import groq from 'groq'; q = groq`*[_type == 'movie']`"],
  [
    "import { groq } from '@nuxtjs/sanity'; q = groq`*[_type == 'movie']`",
    [{ groqs: ["@nuxtjs/sanity"] }],
  ],

  // Valid query (not imported as 'groq')
  ["import hello from 'groq'; q = hello`*[_type == 'movie']`"],
  [
    "import { groq as hello } from '@nuxtjs/sanity'; q = hello`*[_type == 'movie']`",
    [{ groqs: ["@nuxtjs/sanity"] }],
  ],

  // Invalid query tagged with `groq` not from either of the supported packages
  ["import groq from 'somewhere'; q = groq`*[_type == {]`"],

  // Invalid query with template expression
  ["import groq from 'groq'; q = groq`*[_${expression} == {]`"],
  [
    "import { groq } from '@nuxtjs/sanity'; q = groq`*[_${expression} == {]`",
    [{ groqs: ["@nuxtjs/sanity"] }],
  ],
];

const invalidCases = [
  // Syntax error
  ['import groq from "groq"; groq`*[_type == { ]`', { line: 1, column: 44 }],
  [
    'import { groq } from "@nuxtjs/sanity"; groq`*[_type == { ]`',
    { line: 1, column: 58 },
    [{ groqs: ["@nuxtjs/sanity"] }],
  ],

  // Syntax error (not imported as 'groq')
  [
    "import hello from 'groq'; q = hello`*[_type == { ]`",
    { line: 1, column: 50 },
  ],
  [
    "import { groq as hello } from '@nuxtjs/sanity'; q = hello`*[_type == { ]`",
    { line: 1, column: 72 },
    [{ groqs: ["@nuxtjs/sanity"] }],
  ],

  // Syntax error (import all)
  [
    "import * as groq from 'groq'; q = groq`*[_type == { ]`",
    { line: 1, column: 53 },
  ],

  // Syntax error (require)
  [
    "const groq = require('groq'); q = groq`*[_type == { ]`",
    { line: 1, column: 53 },
  ],

  // Multiline with syntax error
  [
    `import groq from "groq";
groq\`*[_type == 'movie']{
  name
  year
}
\`;
  `,
    { line: 4, column: 3 },
  ],

  [
    `import { groq } from "@nuxtjs/sanity";
groq\`*[_type == 'movie']{
  name
  year
}
\`;
  `,
    { line: 4, column: 3 },
    [{ groqs: ["@nuxtjs/sanity"] }],
  ],
];

ruleTester.run("no-syntax-errors", plugin.rules["no-syntax-errors"], {
  valid: validCases.map(([code, options = []]) => ({ code, options })),
  invalid: invalidCases.map(([code, error, options = []]) => ({
    code,
    errors: [{ message: "GROQ syntax error", ...error }],
    options,
  })),
});
