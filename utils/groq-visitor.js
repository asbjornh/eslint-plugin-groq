const astUtils = require("eslint-ast-utils");

const knownGroqs = [
  "groq",
  "@nuxtjs/sanity"
];

/** Expects a function that returns a visitor object. This function is called with a function for checking whether a given tagged template expression is tagged with `groq` */
module.exports = function groqVisitor(visitorFn) {
  // NOTE: Dictionary with identifier names as keys and import paths as values
  let imports = {};

  // NOTE: Checks whether the template tag name is imported from the `groq` package
  const isGroqQuery = node =>
    node.type === "TaggedTemplateExpression" &&
    node.tag.type === "Identifier" &&
    knownGroqs.includes(imports[node.tag.name]) &&
    node.quasi.type === "TemplateLiteral";

  return Object.assign(
    {},
    {
      ImportDeclaration: node => {
        if (node.source.type !== "Literal") return;
        const importSource = node.source.value;
        const importedNames = (node.specifiers || []).map(s => s.local.name);
        importedNames.forEach(name => {
          imports[name] = importSource;
        });
      },
      CallExpression: node => {
        if (astUtils.isStaticRequire(node)) {
          const importedNames = getRequireNames(node.parent.id);
          const importSource = astUtils.getRequireSource(node);
          importedNames.forEach(name => {
            imports[name] = importSource;
          });
        }
      }
    },
    visitorFn(isGroqQuery)
  );
};

function getRequireNames(node) {
  if (!node) return [];
  switch (node.type) {
    case "Identifier":
      return [node.name];
    case "ObjectPattern":
      return node.properties.map(p => getRequireNames(p.value));
  }
}
