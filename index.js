const CharacterReader = require('./character-reader');

// Code which we want to parse
const code = `variable = 5`;

// Create an instance of character reader.
const reader = new CharacterReader(code);

// Should output a 'v'
console.log(reader.peek());