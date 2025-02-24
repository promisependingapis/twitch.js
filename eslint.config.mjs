import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [{
  ignores: ['build/**/*', 'tests/**/*'],
}, ...compat.extends(
  'eslint:recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
), {
  plugins: {
    '@typescript-eslint': typescriptEslint,
  },

  languageOptions: {
    globals: {
      ...globals.commonjs,
      ...globals.node,
    },

    parser: tsParser,
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  rules: {
    '@typescript-eslint/ban-ts-ignore': ['off'],
    '@typescript-eslint/explicit-function-return-type': ['error'],
    '@typescript-eslint/interface-name-prefix': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-unused-expressions': ['error'],
    '@typescript-eslint/no-var-requires': ['off'],
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-non-null-assertion': ['off'],
    'array-bracket-spacing': ['warn', 'never'],
    capIsNew: ['off'],
    'comma-dangle': ['error', 'always-multiline'],
    'computed-property-spacing': 'warn',

    'default-case': ['error', {
      commentPattern: '^no default$',
    }],

    'eol-last': ['error', 'always'],

    indent: ['warn', 2, {
      SwitchCase: 1,
    }],

    'keyword-spacing': ['warn', {
      before: true,
      after: true,
    }],

    'linebreak-style': ['error', 'unix'],

    'max-len': ['warn', {
      code: 250,
      ignoreComments: true,
      ignoreUrls: true,
    }],

    'new-cap': 0,
    'no-async-promise-executor': ['off'],
    'no-await-in-loop': 'warn',
    'no-caller': 2,
    'no-compare-neg-zero': 'error',
    'no-cond-assign': [2, 'except-parens'],
    'no-empty-pattern': ['off'],
    'no-template-curly-in-string': 'error',
    'no-unsafe-negation': 'error',
    'no-undef': ['error'],
    'no-unused-vars': 'off',

    'no-empty': ['error', {
      allowEmptyCatch: true,
    }],

    'no-console': 'off',
    'no-multi-spaces': 'warn',

    'no-use-before-define': [2, {
      functions: false,
      classes: false,
      variables: false,
    }],

    'no-var': ['off'],
    'no-prototype-builtins': ['off'],
    'object-curly-spacing': ['error', 'always'],

    'prefer-const': ['warn', {
      destructuring: 'all',
    }],

    quotes: ['error', 'single', {
      allowTemplateLiterals: true,
    }],

    strict: ['error', 'global'],
    semi: ['error', 'always'],
    'spaced-comment': ['warn', 'always'],
    'sort-keys': ['off'],
    'space-before-function-paren': ['off'],
    'space-infix-ops': 'warn',
  },
}];
