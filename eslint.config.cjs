// eslint.config.cjs - flat config with graceful plugin handling
const js = require('@eslint/js');

// Try to load plugins, but don't fail if they're missing
let prettierPlugin, reactPlugin;

try {
  prettierPlugin = require('eslint-plugin-prettier');
} catch (e) {
  console.warn('⚠️  eslint-plugin-prettier not installed, skipping prettier rules');
}

try {
  reactPlugin = require('eslint-plugin-react');
} catch (e) {
  console.warn('⚠️  eslint-plugin-react not installed, skipping react rules');
}

module.exports = [
  // Base recommended config
  js.configs.recommended,

  // Ignore common build directories
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.git/**",
      "**/.cache/**",
      "**/coverage/**",
      "**/*.min.js"
    ],
  },

  // Backend (Node)
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
        exports: "readonly",
        Buffer: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
      }
    },
    plugins: prettierPlugin ? {
      prettier: prettierPlugin,
    } : {},
    rules: {
      ...(prettierPlugin ? { "prettier/prettier": "warn" } : {}),
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "semi": ["error", "always"],
      "no-undef": "error",
    }
  },

  // Frontend (React)
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
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        HTMLElement: "readonly",
        Event: "readonly",
        // React globals
        React: "readonly",
        JSX: "readonly",
        // Vite/CRA globals
        process: "readonly",
        module: "readonly",
      }
    },
    plugins: {
      ...(reactPlugin ? { react: reactPlugin } : {}),
      ...(prettierPlugin ? { prettier: prettierPlugin } : {}),
    },
    settings: reactPlugin ? {
      react: { version: "detect" }
    } : {},
    rules: {
      ...(prettierPlugin ? { "prettier/prettier": "warn" } : {}),
      ...(reactPlugin ? {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "warn",
      } : {}),
      "no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "no-undef": "error",
    }
  },

  // Tests: relax some checks for test files
  {
    files: [
      "**/*.test.{js,jsx,ts,tsx}",
      "**/*.spec.{js,jsx,ts,tsx}",
      "**/__tests__/**/*.{js,jsx,ts,tsx}"
    ],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      }
    },
    rules: {
      "no-unused-expressions": "off",
      "no-undef": "off",
    }
  },

  // Config files
  {
    files: ["**/*.config.{js,cjs,mjs}", "**/.*rc.{js,cjs}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
      }
    },
    rules: {
      "no-console": "off",
    }
  }
];