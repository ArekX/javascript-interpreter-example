# javascript-interpreter-example

Javascript Interpreter Example Code

This is an implementation of an language in pure javascript purpose of this repository is to demonstrate how such an interpreter can be built.

# Chapter 1

## Building a lexer

We will start our journey by building a lexer. Lexer is a piece of software which reads characters and transforms them into tokens. We will then use those tokens in the next stage.

You might think "ok this is easy, we will just use some regex to find things in the code string we want and produce tokens". This is not a good approach as you need to be able to also detect the correct positions of the token and without a really complicated regex that might not be possible and can lead to bugs.

That is not to say that we won't use regex at all, we will use it but on a character level to detect a specific range of characters like uppercase / lowercase letters and numbers.

Our first order of business is to read characters one by one. We will need to read characters and store state where we are so that lexer can check for some characters ahead or before to make decisions whether it can detect a specific token or not.

So to start we need a character reader:

```js
module.exports = class CharacterReader {
    constructor(code) {
        this.code = code; // store code which we will read through
        this.characterPosition = 0; // Current character in a line of code text
        this.linePosition = 0; // Current line in the code text
        this.position = 0; // Current character in the code string.
    }

    // Return amount of characters specified by `amount`
    // without advancing the character reader.
    peek(amount = 1) {
        return this.code.substring(this.position, this.position + amount);
    }

    // Advance the character reader by specified amount
    next(amount = 1) {
        // we need a loop to go through all of the characters
        // by the specified amount so that we can properly
        // determine when a new line happened so that we
        // can keep proper line and character position.
        for(let i = this.position; i < this.position + amount; i++) {
            if (this.code[i] == '\n') { // If a new line character is detected
                this.linePosition++; // Increase line position
                this.characterPosition = 0; // Reset character position as it is a new line.
                continue;
            }

            this.characterPosition++; // Increase character position for the line.
        }

        this.position += amount; // Change current reader position in code string.
    }

    // Getter to just return current character position in the line in the code.
    getCharacterPosition() {
        return this.characterPosition;
    }

    // Getter to return current line position in the code
    getLinePosition() {
        return this.linePosition;
    }

    // Check and return whether there is more code to parse.
    hasNext() {
        return this.position < this.code.length;
    }
}
```

And to use it lets write:

```js
const CharacterReader = require('./character-reader');

const code = `variable = 5`;

const reader = new CharacterReader(code);

console.log(reader.peek()) // we should get 'v'
```
