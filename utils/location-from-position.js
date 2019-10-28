function numberOfCharactersInLines(lines, numberOflines) {
  return lines.slice(0, numberOflines).join("").length;
}

module.exports = function locationFromPosition(
  multiLineString,
  characterPosition,
  offsetLoc
) {
  const lines = multiLineString.split(/[\r\n]/).map(l => `${l}\n`);

  if (lines.length === 1) {
    // NOTE: characterPosition starts at 0 while ESTree loc starts at 1
    return {
      line: offsetLoc.line,
      column: offsetLoc.column + characterPosition + 1
    };
  }

  const lineIndex = lines.findIndex(
    (_line, index) =>
      numberOfCharactersInLines(lines, index + 1) >= characterPosition
  );
  const colIndex =
    characterPosition - numberOfCharactersInLines(lines, lineIndex);

  return { line: offsetLoc.line + lineIndex, column: colIndex };
};
