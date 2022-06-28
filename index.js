// Code which we want to parse
const code = `
negativeCheck = 2 + -5.5;

if (negativeCheck < 0) {
    print('Visible');
} else {
    print('Not Visible');
}
`;

// Import the lexer
const analyseCode = require('./lexer-analyser');

// Run the lexer
const tokens = analyseCode(code);

// Import the parser
const parseTokens = require('./parser-analyser');

// Run the parser
const statements = parseTokens(tokens);


// Import the interpreter
const interpret = require('./interpreter');

// We create a virtual state machine object
const vm = {
    variables: {},
    functions: {
        print(message) { // We add a print function so that we can call a function from our code.
            console.log('MESSAGE:', message); 
        },
        pow(x, y) { // We also add a function which returns something for an expression.
            return Math.pow(x, y);
        }
    }
};

// Interpret the statements and return last result.
const result = interpret(statements, vm);

// And finally we output the result
console.log('Result:')
console.dir(result, {depth: null});
