import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const SRC_FOLDERS = [
  'layouts',
  'components',
  'theme',
  'lib',
  'i18n',
  'assets',
  'scripts',
];

export default tseslint.config(
  {
    ignores: ['dist', '.astro', 'node_modules', 'public'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],
  prettier,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },

    plugins: {
      '@stylistic': stylistic,
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-else-return': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Import from @/ unless the file is in the same folder.',
            },
          ],
        },
      ],

      'arrow-body-style': ['error', 'as-needed'],
      'no-lonely-if': 'error',
      'no-unneeded-ternary': 'error',
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',

      '@stylistic/jsx-self-closing-comp': 'error',
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
      ],
      '@stylistic/spaced-comment': ['error', 'always'],

      'astro/jsx-a11y/no-noninteractive-tabindex': [
        'error',
        { roles: ['region'] },
      ],

      'simple-import-sort/imports': [
        'error',
        {
          // Stylesheets last, where they load after the code that uses them.
          groups: [
            ['^\\u0000(?!.*\\.css$)'],
            ['^node:', '^@?\\w'],
            ...SRC_FOLDERS.map((folder) => [`^@/${folder}(/|$)`]),
            ['^'],
            ['^\\.'],
            ['^\\u0000.*\\.css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  {
    // Components carry their own styles, so their order sets the cascade.
    files: ['**/*.astro'],
    rules: { 'simple-import-sort/imports': 'off' },
  },

  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);
