// eslint.config.cjs - Flat config with proper plugin handling
const js = require('@eslint/js');

// Safely import plugins
let prettierPlugin, reactPlugin;

try {
  prettierPlugin = require('eslint-plugin-prettier');
} catch (e) {
  console.warn('⚠️  eslint-plugin-prettier not found');
}

try {
  reactPlugin = require('eslint-plugin-react');
} catch (e) {
  console.warn('⚠️  eslint-plugin-react not found');
}

module.exports = [
  js.configs.recommended,
  
  // Ignore directories
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.cache/**",
      "**/coverage/**"
    ],
  },

  // Backend configuration
  {
    files: ["backend/**/*.{js,cjs,mjs,jsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        console: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
      }
    },
    plugins: prettierPlugin ?  {
      prettier: prettierPlugin
    } : {},
    rules: {
      ...(prettierPlugin && { "prettier/prettier": "warn" }),
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "semi": ["warn", "always"]
    }
  },

  // Frontend configuration
  {
    files: ["frontend/src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
      }
    },
    plugins: {
      ...(reactPlugin && { react: reactPlugin }),
      ...(prettierPlugin && { prettier: prettierPlugin })
    },
    settings: reactPlugin ? {
      react: { version: "detect" }
    } : {},
    rules: {
      ...(prettierPlugin && { "prettier/prettier": "warn" }),
      ...(reactPlugin && {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "warn"
      }),
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    }
  },

  // Test files
  {
    files: ["**/*.test.{js,jsx}", "**/__tests__/**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly"
      }
    },
    rules: {
      "no-unused-expressions": "off"
    }
  }
];