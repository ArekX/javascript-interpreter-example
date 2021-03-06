// Code which we want to parse
const code = `
firstName = 'John';
lastName = 'Smith';
age = 50;

print('Entered name: ' + firstName + ', ' + lastName);

if (age > 40) {
    if (age > 45) {
        print('Age is above 45');
    }
    print('Welcome, ' + firstName + ' you are ' + age + ' old.');
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
console.log('Code we ran:');
console.log(code);
console.log('Result:')
console.dir(result, {depth: null});
console.log('Final VM State:', vm);
