// Code which we want to parse
const code = `i = 5;`;

// Import the lexer
const analyseCode = require('./lexer-analyser');

// Run the lexer
const tokens = analyseCode(code);

// Import the parser
const parseTokens = require('./parser-analyser');

// Run the parser
const statements = parseTokens(tokens);

// Finally we output the statements we parsed.
console.dir(statements, { depth: null });