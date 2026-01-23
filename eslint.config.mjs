import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactNativePlugin from 'eslint-plugin-react-native';

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: reactPlugin,
      'react-native': reactNativePlugin,
    },
    rules: {
      // TypeScript Rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // React Rules
      'react/react-in-jsx-scope': 'off', // Not needed in React Native
      'react/prop-types': 'off', // Using TypeScript for props validation

      // React Native Rules
      'react-native/no-unused-styles': 'warn',
      'react-native/no-inline-styles': 'off', // Allow inline styles (common in RN)
      'react-native/no-color-literals': 'off', // Allow color literals

      // General Best Practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'prefer-const': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Ignore build outputs and dependencies
    ignores: [
      'node_modules/**',
      'dist/**',
      '.expo/**',
      '.expo-shared/**',
      '*.log',
    ],
  },
];
