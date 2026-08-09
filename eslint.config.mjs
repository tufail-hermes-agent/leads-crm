import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Starter-kit compatibility: these rules conflict with existing
      // third-party/demo patterns shipped by the upstream template.
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/no-children-prop': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/incompatible-library': 'off'
    }
  },
  globalIgnores(['.next/**', 'node_modules/**', 'out/**', 'build/**'])
]);
