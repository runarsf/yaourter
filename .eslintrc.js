module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 13
    // 'ecmaVersion': 12,
    // 'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'object-curly-spacing': [
      'error',
      'always',
      {
        'arraysInObjects': false,
        'objectsInObjects': false
      }
    ],
    'array-bracket-spacing': [
      'error',
      'always',
      {
        'singleValue': false,
        'objectsInArrays': false,
        'arraysInArrays': false
      }
    ],
    'computed-property-spacing': [
      'error',
      'always',
      {
        'enforceForClassMembers': false
      }
    ],
    'no-multi-spaces': ['error'],
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  }
};
