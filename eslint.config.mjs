import { basename } from 'node:path';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const UP_A_FOLDER = {
  group: ['../*'],
  message: 'Import from @/ unless the file is in the same folder.',
};

// A component's stylesheet sits beside it and takes its name: Logo.tsx imports
// ./Logo.css. A variant, such as StyleCardSkeleton, may import its base's.
const cssNamedAfterComponent = {
  meta: {
    type: 'suggestion',
    messages: { name: "Name this component's stylesheet ./{{name}}.css." },
  },
  create(context) {
    const name = basename(context.filename).replace(/\.\w+$/, '');

    return {
      ImportDeclaration(node) {
        const css = /^\.\/([^/]+)\.css$/.exec(node.source.value)?.[1];

        if (css && !name.startsWith(css)) {
          context.report({ node, messageId: 'name', data: { name } });
        }
      },
    };
  },
};

const SRC_FOLDERS = [
  'www',
  'gallery',
  'layouts',
  'components',
  'theme',
  'lib',
  'i18n',
  'assets',
];

export default tseslint.config(
  {
    ignores: [
      'dist',
      'dist-gallery',
      '.astro',
      'node_modules',
      'src/www/public',
      'src/gallery/public',
    ],
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
      local: { rules: { 'css-named-after-component': cssNamedAfterComponent } },
    },

    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-else-return': 'error',
      'no-restricted-imports': ['error', { patterns: [UP_A_FOLDER] }],
      'local/css-named-after-component': 'error',

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
    // Islands run in the browser, and @/i18n carries every locale's catalog.
    files: ['src/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [UP_A_FOLDER],
          paths: [
            {
              name: '@/i18n',
              message: 'Import from @/i18n/t, @/i18n/format or @/i18n/locales.',
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
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
