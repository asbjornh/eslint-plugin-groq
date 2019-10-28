const groqVisitor = require("../utils/groq-visitor");
const locationFromPosition = require("../utils/location-from-position");
const { parse } = require("groq-js");

module.exports = {
  create: function(context) {
    return groqVisitor(isGroqQuery => ({
      TaggedTemplateExpression: node => {
        if (!isGroqQuery(node)) return;
        // NOTE: Bail if the template literal contains expressions because their values are hard to know statically.
        if (node.quasi.expressions.length > 0) return;

        const [queryNode] = node.quasi.quasis;
        const queryString = queryNode.value.raw;

        try {
          parse(queryString);
        } catch (error) {
          const loc = locationFromPosition(
            queryString,
            error.position,
            queryNode.loc.start,
            queryNode.loc.end
          );
          context.report({ loc, message: "GROQ syntax error" });
        }
      }
    }));
  }
};
