// Code which we want to parse
const code = `variable = 5;`;

// Import the lexer
const analyseCode = require('./lexer-analyser');

// Run the lexer
const tokens = analyseCode(code);

// Should output the tokens
console.log(tokens);

