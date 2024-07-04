module.exports = {
  env: { node: true, jest: true },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:perfectionist/recommended-natural',
    'prettier',
  ],
  ignorePatterns: ['.eslintrc.js', 'dist/**/*', 'node_modules/**/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'perfectionist', 'prettier'],
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'warn',
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
        'ignore-case': true,
        groups: ['builtin', 'react', 'external', 'internal', 'parent', 'sibling'],
        'custom-groups': {
          value: { react: ['next', 'next/**', 'react'], internal: ['@/**'] },
          type: { react: 'react' },
        },
        'newlines-between': 'always',
      },
    ],
    'prettier/prettier': 'error',
  },
};
