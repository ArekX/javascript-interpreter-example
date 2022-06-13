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
        for (let i = this.position; i < this.position + amount; i++) {
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

    // Check and return whether ther is more code to parse.
    hasNext() {
        return this.position < this.code.length;
    }
}