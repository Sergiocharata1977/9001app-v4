module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended'
  ],
  plugins: ['node'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'script' // CommonJS
  },
  rules: {
    // Forzar CommonJS en backend
    'import/no-commonjs': 'off',
    'node/no-unsupported-features/es-syntax': ['error', { 
      ignores: ['modules'] 
    }],
    // Reglas de estilo
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    // Node.js específicas
    'node/exports-style': ['error', 'module.exports'],
    'node/file-extension-in-import': ['error', 'always'],
    'node/prefer-global/buffer': ['error', 'always'],
    'node/prefer-global/console': ['error', 'always'],
    'node/prefer-global/process': ['error', 'always'],
    'node/prefer-global/url-search-params': ['error', 'always'],
    'node/prefer-global/url': ['error', 'always'],
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js'
  ]
};
