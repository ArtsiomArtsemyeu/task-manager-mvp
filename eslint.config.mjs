// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import fsdPlugin from 'eslint-plugin-fsd-lint';
import tseslint from 'typescript-eslint';

const fsdOptions = {
  rootPath: '/src/',
  alias: {
    value: '@',
    withSlash: true,
  },
  tsconfigPath: './tsconfig.json',
  ignoreImportPatterns: ['\\.css$', '\\.module\\.css$'],
};

const typeAwareFiles = ['**/*.{ts,tsx,mts,cts}'];

const eslintConfig = defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'docs/**',
    'storybook-static/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
  ]),
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  ...nextVitals,
  ...nextTs,
  {
    files: typeAwareFiles,
    extends: [
      tseslint.configs.recommendedTypeCheckedOnly,
      tseslint.configs.strictTypeCheckedOnly,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true,
        },
      ],
    },
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      fsd: fsdPlugin,
    },
    rules: {
      'fsd/forbidden-imports': ['error', fsdOptions],
      'fsd/no-cross-slice-dependency': [
        'error',
        {
          ...fsdOptions,
          allowTypeImports: true,
        },
      ],
      'fsd/no-public-api-sidestep': [
        'error',
        {
          ...fsdOptions,
          ignoreImportPatterns: [...fsdOptions.ignoreImportPatterns, '/@x/'],
        },
      ],
      'fsd/no-relative-imports': [
        'error',
        {
          ...fsdOptions,
          allowSameSlice: true,
        },
      ],
      'fsd/no-ui-in-business-logic': ['error', fsdOptions],
      'fsd/no-global-store-imports': 'error',
      'fsd/ordered-imports': ['error', fsdOptions],
    },
  },
  ...storybook.configs['flat/recommended'],
  eslintConfigPrettier,
]);

export default eslintConfig;
