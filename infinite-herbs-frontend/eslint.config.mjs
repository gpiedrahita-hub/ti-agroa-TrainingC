import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
        'react-hooks/set-state-in-effect': 'off',
    },
  },
  
  globalIgnores([
    '.next/**',
    'out/**',
    'dist/**',
    'build/**',
    'next-env.d.ts',
    '*.config.js',
  ]),
]);

export default eslintConfig;