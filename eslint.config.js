import js from "@eslint/js";
import globals from "globals";

export default [
    { ignores: ["dist/", "node_modules/", "docs/"] },
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.browser },
        },
    },
    {
        files: ["*.config.js"],
        languageOptions: { globals: { ...globals.node } },
    },
];
