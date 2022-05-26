module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    strict: 'error',
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'space-before-function-paren': ['error', 'never'],
    'no-use-before-define': ['warn', { functions: true, classes: true, variables: true }],
    'no-tabs': ['error', { allowIndentationTabs: false }],
    'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    'non-unused-expressions': ['off'],
    'linebreak-style': ['error', 'unix']
  }
}
