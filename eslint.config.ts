import tseslint from 'typescript-eslint';
import globals from 'globals';
import configPrettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['**/dist/**', '**/docs/**', '**/node_modules/**']
    },
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node
            }
        },
        rules: {
            'no-console': 'warn',
            'no-debugger': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'off'
        }
    },
    configPrettier
);
