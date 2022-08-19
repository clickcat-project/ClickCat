module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // 分号限制
    'semi': [2, 'never'], 
    //引号类型
    'quotes': [1, 'single'],
    'vue/multi-word-component-names': [0, {
      'ignores': ['index', 'login']
    }],
    // 空标签自动闭合
    'vue/html-self-closing': 'off',
    'vue/comment-directive': 'off',
    // 禁止使用any
    '@typescript-eslint/no-explicit-any': 'off',
  }
}
