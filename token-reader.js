class TokenReader {
    constructor(tokens) {
        this.tokens = tokens; // store tokens for further use
        this.position = 0; // current position in token list
        this.stateStack = []; // state stack so that we can rollback if we do not match something.
    }

    // Push current state to the stack
    // this allows us to go back to this state
    // if we do not match anything
    pushState() {
        this.stateStack.push(this.position);
    }

    // Restore last pushed state
    // we will call this when we read as far
    // as we could but we didn't match what we need.
    restoreState() {
        this.position = this.popState();
    }

    // Pops the last state from the list and returns it.
    // We will call this when we need to lose the 
    // last saved state when we matched something and we
    // do not need to go back.
    popState() {
        return this.stateStack.pop();
    }

    // Checks whether the current token is of a
    // specific type or not.
    isType(type) {
        return this.hasNext() && this.getType() === type;
    }

    // Returns the type of the current token.
    getType() {
        return this.get().type;
    }

    // Returns the value of the current token.
    getValue() {
        return this.get().value;
    }

    // Checks whether the value in the current token
    // matches.
    isValue(value) {
        return this.getValue() === value;
    }

    // Returns the token at the current position.
    get() {
        return this.tokens[this.position];
    }

    // Returns the very last token in the list.
    getLastToken() {
        return this.tokens[this.tokens.length - 1];
    }

    // Move to the next token in the position.
    next() {
        this.position++;
    }

    // Check and return whether there are more tokens to
    // consume.
    hasNext() {
        return this.position < this.tokens.length;
    }
}

module.exports = TokenReader;