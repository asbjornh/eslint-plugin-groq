const groqVisitor = require("../utils/groq-visitor");

module.exports = {
  create: function(context) {
    return groqVisitor(isGroqQuery => ({
      TaggedTemplateExpression: node => {
        if (isGroqQuery(node) && node.quasi.expressions.length > 0) {
          node.quasi.expressions.forEach(expression => {
            context.report({
              node: expression,
              message: "Unexpected template expression in GROQ query"
            });
          });
        }
      }
    }));
  }
};
