/* Classic ESLint config (eslint v8) for a Vite + React 18 app. */
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh'],
  ignorePatterns: ['dist', 'node_modules', '*.config.js', 'public'],
  rules: {
    // react-three-fiber turns three.js props (args, position, rotation,
    // material, intensity, …) into JSX attributes the React plugin can't
    // know about. Disable this rule project-wide (standard for r3f apps).
    'react/no-unknown-property': 'off',
    // Project uses lots of curly apostrophes in copy — not an error.
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
}
