const pluginName = "local";

module.exports = {
  rules: {
    "no-template-expressions": require("./rules/no-template-expressions"),
    "no-syntax-errors": require("./rules/no-syntax-errors")
  },
  configs: {
    recommended: {
      plugins: [pluginName],
      rules: {
        [`${pluginName}/no-template-expressions`]: "error",
        [`${pluginName}/no-syntax-errors`]: "error"
      }
    }
  }
};
