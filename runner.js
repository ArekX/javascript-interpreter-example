const analyseCode = require('./lexer-analyser');
const parseTokens = require('./parser-analyser');
const interpretStatements = require('./interpreter');

module.exports = (code, vm) => {
    const tokens = analyseCode(code);
    const statements = parseTokens(tokens);

    return interpretStatements(statements, vm);
};

