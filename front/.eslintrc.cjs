module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:promise/recommended",
    // "plugin:jest/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/stylistic",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier"
  ],
  ignorePatterns: [
    "dist",
    ".eslintrc.cjs",
    "tsconfig.json",
    "tsconfig.node.json",
    "prettier.config.cjs",
    "vite.config.ts"
  ],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: "."
  },
  plugins: [
    "react-refresh",
    "optimize-regex",
    "@typescript-eslint",
    "prettier"
  ],
  globals: {
    JSX: "readonly"
  },
  rules: {
    "react-refresh/only-export-components": "off",
    "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_$" }
    ],
    "no-undef": ["error", { typeof: true }],
    "no-template-curly-in-string": "error",
    "block-scoped-var": "error",
    curly: ["error", "all"],
    "no-console": "warn",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-new-require": "error",
    "no-new-object": "error",
    "no-new-symbol": "error",
    "no-new-native-nonconstructor": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true }
    ],
    "prefer-promise-reject-errors": ["error", { allowEmptyReject: true }],
    radix: "error",
    "no-undefined": "off",
    "array-bracket-newline": ["error", "consistent"],
    "comma-dangle": ["error", "never"],
    "comma-style": "error",
    eqeqeq: "error",
    // "sort-imports": [
    //   "warn",
    //   {
    //     ignoreCase: false,
    //     ignoreDeclarationSort: false,
    //     ignoreMemberSort: true,
    //     memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
    //     allowSeparatedGroups: false
    //   }
    // ],
    "keyword-spacing": "error",
    "new-parens": "error",
    "no-bitwise": "off",
    "no-lonely-if": "warn",
    "no-multiple-empty-lines": "error",
    "no-trailing-spaces": "error",
    "no-unneeded-ternary": "error",
    "no-whitespace-before-property": "error",
    "object-curly-newline": "error",
    "object-curly-spacing": ["error", "always"],
    "semi-spacing": "error",
    "space-before-blocks": "error",
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always"
      }
    ],
    "space-in-parens": "error",
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "switch-colon-spacing": "error",
    "arrow-body-style": ["error", "as-needed"],
    // "arrow-parens": ["error", "as-needed"],
    "arrow-spacing": "error",
    "generator-star-spacing": ["error", "after"],
    "no-useless-computed-key": "error",
    "no-useless-rename": "error",
    "object-shorthand": ["error", "always"],
    "prefer-arrow-callback": "warn",
    "prefer-destructuring": "off",
    "rest-spread-spacing": ["error", "never"],
    "template-curly-spacing": "error",
    "promise/always-return": "off",
    "optimize-regex/optimize-regex": "warn",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      { multiline: { delimiter: "semi" } }
    ],
    "@typescript-eslint/member-ordering": "off", // иначе ругается на flow экшны mobx
    "@typescript-eslint/brace-style": ["error", "1tbs"],
    "@typescript-eslint/func-call-spacing": ["error", "never"],
    "@typescript-eslint/prefer-for-of": "warn",
    "@typescript-eslint/parameter-properties": [
      "error",
      { prefer: "parameter-property" }
    ],
    // "@typescript-eslint/no-parameter-properties": "error",
    "@typescript-eslint/no-unnecessary-type-arguments": "off", // иначе ругается на i18nInstance.t<string>
    "@typescript-eslint/prefer-function-type": "warn",
    "@typescript-eslint/prefer-readonly": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/camelcase": "off", // https://github.com/typescript-eslint/typescript-eslint/issues/2077
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true }
    ],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-floating-promises": [
      "off",
      { ignoreVoid: true, ignoreIIFE: true }
    ],
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      { allowAny: true }
    ],
    "@typescript-eslint/unbound-method": "off",
    "react/no-access-state-in-setstate": "error",
    "react/no-danger": "error",
    "react/no-multi-comp": ["warn", { ignoreStateless: true }],
    "react/no-this-in-sfc": "error",
    "react/prefer-stateless-function": "error",
    "react/jsx-filename-extension": ["error", { extensions: [".tsx", ".jsx"] }],
    "react/jsx-no-bind": "off",
    "react/jsx-pascal-case": "error",
    "react-hooks/rules-of-hooks": "error",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
    "react/no-array-index-key": "error",
    "prettier/prettier": [
      "error",
      {
        trailingComma: "none",
        semi: true,
        tabWidth: 2,
        singleQuote: false,
        bracketSpacing: true,
        jsxBracketSameLine: true,
        endOfLine: "auto",
        bracketSameLine: true
      }
    ],
    "sonarjs/no-nested-template-literals": "off",
    "import/no-named-as-default-member": "off",
    "promise/prefer-await-to-then": "off",
    "no-nested-ternary": "warn",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "no-shadow": "off",
    "max-classes-per-file": "warn",
    "import/order": "warn",
    "no-return-await": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "react-hooks/exhaustive-deps": "off"
  },
  settings: {
    react: {
      version: "detect"
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      node: {
        paths: ["src"]
      },
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: "."
      }
    }
  }
};
