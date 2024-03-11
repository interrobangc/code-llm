// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require('./tsconfig.json');

const config = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
    'prettier',
    'plugin:sonarjs/recommended',
    'plugin:typescript-sort-keys/recommended',
  ],
  ignorePatterns: [
    '**/dist/**',
    '**/coverage/**',
    'node_modules/**',
    '**/node_modules/**',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'sonarjs',
    'sort-destructure-keys',
    'sort-keys-fix',
    'typescript-sort-keys',
  ],
  rules: {
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/dot-notation': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      { ts: 'never', tsx: 'never' },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/tests/**',
          '**/*.test.{ts,tsx}',
          '**/.eslintrc.cjs',
        ],
        optionalDependencies: false,
        packageDir: [
          './',
          ...tsConfig.references.map((ref) => `./${ref.path}`),
        ],
      },
    ],
    'no-console': 'error',
    'sonarjs/prefer-single-boolean-return': 'off',
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'sort-keys': 'error',
    'sort-keys-fix/sort-keys-fix': 'warn',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['cli/tsconfig.json', 'codellm/tsconfig.json'],
      },
    },
  },
};

module.exports = config;