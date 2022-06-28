// Code which we want to parse
const code = `
firstName = 'John';
lastName = 'Smith';
print('Hello, ' + firstName + ' ' + lastName);
`;


// We include our parser
const { parse } = require('./printly-parser');

// Everything gets parsed here and
// transformed into statements
const statements = parse(code);

// Import the interpreter
const interpret = require('./interpreter');

// We create a virtual state machine object
const vm = {
    variables: {},
    functions: {
        print(message) { // We add a print function so that we can call a function from our code.
            console.log('MESSAGE:', message);
        }
    }
};
// Interpret the statements and return last result.
const result = interpret(statements, vm);

// And finally we output the result
console.log('Result:')
console.dir(result, { depth: null });