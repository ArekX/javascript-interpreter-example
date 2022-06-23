class TokenReader {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
        this.stateStack = [];
    }

    pushState() {
        this.stateStack.push(this.position);
    }

    restoreState() {
        this.position = this.popState();
    }

    popState() {
        return this.stateStack.pop();
    }

    isType(type) {
        return this.hasNext() && this.getType() === type;
    }

    isTypeValue(type, value) {
        return this.isType(type) && this.isValue(value);
    }

    getType() {
        return this.get().type;
    }

    getValue() {
        return this.get().value;
    }

    isValue(value) {
        return this.getValue() === value;
    }

    get() {
        return this.tokens[this.position];
    }

    // moves to next position by amount
    next() {
        this.position++;
    }

    // whether there is next amount to consume.
    hasNext() {
        return this.position < this.tokens.length;
    }
}

module.exports = TokenReader;