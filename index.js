// Code which we want to parse
const code = `abbs = 5;
opop(2,3,4,5,6,7, 'strr');
babs = 6;

if(5) {
    sad = 5;
}

fnname();`;

// Import the lexer
const analyseCode = require('./lexer-analyser');

// Run the lexer
const tokens = analyseCode(code);

// Should output the tokens
//console.log(tokens);

const parse = require('./grammar');
const TokenReader = require('./token-reader');
const reader = new TokenReader(tokens);

const statements = [];

while(reader.hasNext()) {
    const statement = parse(reader);

    if (statement) {
        statements.push(statement);
    } else {
        let token = null;
        if (reader.hasNext()) {
            token = reader.get();
        } else {
            token = reader.tokens[reader.tokens.length - 1];
        }
 
        throw new Error(`Syntax error. Expected an assignment, function call or an if statement. At: ${token.line}:${token.character}`);
    }
}

// console.log(tokens);
console.dir(statements, {depth: null});

