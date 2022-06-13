const analyseCode = require('./lexer-analyser');
const parseTokens = require('./parse');
const interpretStatements = require('./interpreter');

module.exports = (code, vm) => {
    const tokenReader = analyseCode(code);
    const statements = parseTokens(tokenReader);

    return interpretStatements(statements, vm);
};

