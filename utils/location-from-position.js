function numberOfCharactersInLines(lines, numberOflines) {
  return lines.slice(0, numberOflines).join("").length;
}

module.exports = function locationFromPosition(
  multiLineString = "",
  characterPosition,
  start = { line: 0, column: 0 },
  end = { line: 0, column: 0 }
) {
  const lines = multiLineString.split(/[\r\n]/).map(l => `${l}\n`);

  if (!characterPosition) {
    return { start, end };
  }

  if (lines.length === 1) {
    // NOTE: characterPosition starts at 0 while ESTree loc starts at 1
    return {
      line: start.line,
      column: start.column + characterPosition + 1
    };
  }

  const lineIndex = lines.findIndex(
    (_line, index) =>
      numberOfCharactersInLines(lines, index + 1) >= characterPosition
  );
  const colIndex =
    characterPosition - numberOfCharactersInLines(lines, lineIndex);

  return { line: start.line + lineIndex, column: colIndex };
};
