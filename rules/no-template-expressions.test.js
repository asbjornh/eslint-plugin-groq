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

  // Tagged query without expressions
  ["import groq from 'groq'; q = groq`*[_type == 'movie']`"],
  [
    "import { groq } from '@nuxtjs/sanity'; q = groq`*[_type == 'movie']`",
    [{ groqs: ["@nuxtjs/sanity"] }],
  ],

  // Non-tagged query with expression
  ["`*[_type == ${type}]`"],

  // Query with expression tagged with `groq` not from the `groq` package
  ["import groq from 'somewhere'; q = groq`*[_type == ${type}]`"],
];

const invalidCases = [
  // Template expression
  ['import groq from "groq"; groq`*[_type == ${type}]`'],
  [
    'import { groq } from "@nuxtjs/sanity"; groq`*[_type == ${type}]`',
    [{ groqs: ["@nuxtjs/sanity"] }],
  ],

  // Template expression (not imported as 'groq')
  ["import hello from 'groq'; q = hello`*[_type == ${type}]`"],
  [
    "import { groq as hello } from '@nuxtjs/sanity'; q = hello`*[_type == ${type}]`",
    [{ groqs: ["@nuxtjs/sanity"] }],
  ],

  // Template expression (import all)
  ["import * as groq from 'groq'; q = groq`*[_type == ${type}]`"],

  // Teplate expression (require)
  ["const groq = require('groq'); q = groq`*[_type == ${type}]`"],
];

ruleTester.run(
  "no-template-expressions",
  plugin.rules["no-template-expressions"],
  {
    valid: validCases.map(([code, options = []]) => ({ code, options })),
    invalid: invalidCases.map(([code, options = []]) => ({
      code,
      errors: ["Unexpected template expression in GROQ query"],
      options,
    })),
  }
);
