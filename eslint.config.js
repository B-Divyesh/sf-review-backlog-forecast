import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "graphify-out/**", "public/sw.js"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      "no-undef": "off"
    }
  },
  {
    files: ["public/assets/*.js"],
    languageOptions: { globals: globals.browser }
  }
);
