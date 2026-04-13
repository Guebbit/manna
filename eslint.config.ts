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
            '@typescript-eslint/no-non-null-assertion': 'off',

            /*
             * ── Naming conventions ──────────────────────────────────────
             * Enforces consistent identifier casing across the codebase.
             * Set to "warn" so existing code can be migrated incrementally.
             */
            '@typescript-eslint/naming-convention': [
                'warn',

                // Default: camelCase for any identifier not covered below
                {
                    selector: 'default',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow'
                },

                // Variables: camelCase or UPPER_CASE (module-level constants)
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow'
                },

                // Functions: camelCase
                {
                    selector: 'function',
                    format: ['camelCase']
                },

                // Parameters: camelCase (leading underscore for unused params)
                {
                    selector: 'parameter',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow'
                },

                // All type-like identifiers (type aliases, classes): PascalCase
                {
                    selector: 'typeLike',
                    format: ['PascalCase']
                },

                // Interfaces: PascalCase with I prefix (e.g. ITool, IProcessor)
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                    prefix: ['I']
                },

                // Enums: PascalCase with E prefix (e.g. EProfile, ELogLevel)
                {
                    selector: 'enum',
                    format: ['PascalCase'],
                    prefix: ['E']
                },

                // Enum members: PascalCase or UPPER_CASE
                {
                    selector: 'enumMember',
                    format: ['PascalCase', 'UPPER_CASE']
                },

                // Import names: allow any format (third-party modules)
                {
                    selector: 'import',
                    format: null
                },

                // Object literal properties: no enforcement (external APIs, configs)
                {
                    selector: 'objectLiteralProperty',
                    format: null
                },

                // Class properties and methods: camelCase (private may use underscore)
                {
                    selector: 'classProperty',
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow'
                },
                {
                    selector: 'classMethod',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow'
                },

                // Type properties: camelCase (allow flexibility for schema shapes)
                {
                    selector: 'typeProperty',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow'
                }
            ]
        }
    },
    configPrettier
);
