import eslint from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['node_modules/**', 'public/build/**', 'storage/**', 'vendor/**', 'tests/e2e/**'],
    },
    {
        files: ['resources/js/**/*.{ts,tsx}'],
        extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'react-hooks/preserve-manual-memoization': 'off',
            'react-hooks/set-state-in-effect': 'off',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },
);
