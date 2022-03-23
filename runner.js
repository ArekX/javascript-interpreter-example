const CharacterReader = require('./character-reader');
const TokenReader = require('./token-reader');

const tokens = require('./tokens');
const parseTokens = require('./parse');
const interpretStatements = require('./interpreter');

module.exports = (code, vm) => {
    const reader = new CharacterReader(code);

    const foundTokens = [];

    while (reader.hasNext()) {
        let token = null;

        let startPosition = reader.position;
        let linePosition = reader.getLinePosition();
        let characterPosition = reader.getCharacterPosition();

        for (const readToken of tokens) {
            token = readToken(reader);

            if (token) {
                break;
            }
        }

        if (!token) {
            throw new Error(`Invalid character '${reader.peek()}' at ${linePosition}:${characterPosition}`);
        }

        foundTokens.push({
            ...token,
            start: startPosition,
            end: reader.position,
            line: linePosition,
            character: characterPosition
        });
    }

    const usableTokens = foundTokens.filter(i => i.type !== 'whitespace');

    return interpretStatements(parseTokens(new TokenReader(usableTokens)), vm);
};