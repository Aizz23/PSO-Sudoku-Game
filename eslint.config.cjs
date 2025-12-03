// eslint.config.cjs - flat config (correct use of languageOptions.globals)
module.exports = [
  // Ignore common build directories
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**", "**/.cache/**"],
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
        module: "readonly",
        require: "readonly"
      }
    },
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "quotes": ["error", "single"],
      "semi": ["error", "always"]
    }
  },

  // Frontend (React)
  {
    files: ["frontend/src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      react: require("eslint-plugin-react"),
      prettier: require("eslint-plugin-prettier"),
    },
    settings: {
      react: { version: "detect" }
    },
    rules: {
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "quotes": ["error", "single"]
    }
  },

  // Tests: relax some checks for test files
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/__tests__/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-unused-expressions": "off"
    }
  }
];