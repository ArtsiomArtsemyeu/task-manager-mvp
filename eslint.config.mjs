import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import fsdPlugin from "eslint-plugin-fsd-lint";

const fsdOptions = {
  rootPath: "/src/",
  alias: {
    value: "@",
    withSlash: true,
  },
  tsconfigPath: "./tsconfig.json",
  ignoreImportPatterns: ["\\.css$", "\\.module\\.css$"],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      fsd: fsdPlugin,
    },
    rules: {
      "fsd/forbidden-imports": ["error", fsdOptions],
      "fsd/no-cross-slice-dependency": [
        "error",
        {
          ...fsdOptions,
          allowTypeImports: true,
        },
      ],
      "fsd/no-public-api-sidestep": [
        "error",
        {
          ...fsdOptions,
          ignoreImportPatterns: [
            ...fsdOptions.ignoreImportPatterns,
            "/@x/",
          ],
        },
      ],
      "fsd/no-relative-imports": [
        "error",
        {
          ...fsdOptions,
          allowSameSlice: true,
        },
      ],
      "fsd/no-ui-in-business-logic": ["error", fsdOptions],
      "fsd/no-global-store-imports": "error",
      "fsd/ordered-imports": ["warn", fsdOptions],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
