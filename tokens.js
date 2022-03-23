const readNumberToken = reader => {
    let numberText = '';
    const numberMatch = /\d/;

    while (reader.hasNext()) { // read while not end of code
        if (reader.peek().match(numberMatch)) { // if number matches add to text
            numberText += reader.peek();
            reader.next();
        } else {
            break; // if number is not matched we do not need to search anymore.
        }
    }

    if (numberText.length == 0) {
        return null; // if no number was detected, return no token.
    }

    // return token of type number
    return { type: 'number', value: numberText };
}

const readString = reader => {
    let value = '';
    let startedReading = false;
    let isEscaping = false;

    while (reader.hasNext()) {
        const matchFound = reader.peek() == "'";

        // if we didnt start reading the string and the string character didnt match
        // this means that we didn't encounter a string.
        if (!startedReading && !matchFound) {
            break;
        }

        // This allow us to have a ' character inside
        // our strings as long as we escape it.
        if (reader.peek() == '\\' && !isEscaping) {
            isEscaping = true;
            reader.next();
            continue; // we only consume this character and not add it to value.
        }

        // if we started reading and found a string character,
        // this means that we reached the end of string literal
        if (startedReading && matchFound && !isEscaping) {
            reader.next(); // move to a character after ' in the code.
            break;
        }

        // if we didn't start reading but we found a valid string start
        // we set the state for reading the string.
        if (!startedReading && matchFound) {
            startedReading = true;
            reader.next();
            continue;
        }

        value += reader.peek();
        reader.next();
        isEscaping = false;
    }

    if (value.length == 0) {
        return null; // if no string token was found
    }

    // return token of type string
    return { type: 'string', value };
}

const readOperator = reader => {
    // operators we want to detect.
    const operatorMatch = /^(!|\+|-|\*|\/|==|!=|&&|\|\||<|>|<=|>=|=|!=)$/;

    // get one character operator for check
    const oneCharacterOperator = reader.peek();

    // get two character operator for check
    const twoCharacterOperator = reader.peek(2);

    let value = null;

    if (twoCharacterOperator.match(operatorMatch)) {
        reader.next(2);
        value = twoCharacterOperator; // two character operator was found
    } else if (oneCharacterOperator.match(operatorMatch)) {
        reader.next();
        value = oneCharacterOperator; // one character operator was found
    }

    if (value) {
        return { type: 'operator', value };
    }

    return null;
}

const readName = reader => {
    let value = '';
    const startOfVariableMatch = /[a-z]/;
    const restOfVariableMatch = /[a-zA-Z0-9]/;

    // If we did not match variable, do not return a token.
    if (!reader.peek().match(startOfVariableMatch)) {
        return null;
    }

    value = reader.peek();
    reader.next();

    while (reader.hasNext() && reader.peek().match(restOfVariableMatch)) {
        // add a character to value as long as we match the variable name.
        value += reader.peek();
        reader.next();
    }

    // we return a variable token
    return { type: 'name', value };
}

const readKeyword = reader => {
    if (reader.peek(2).match(/^if$/i)) {
        reader.next(2);
        return { type: 'keyword', value: 'if' };
    }

    return null;
}

const readParentheses = reader => {
    if (reader.peek() == '(') {
        reader.next();
        return { type: 'parenStart', value: '(' };
    }

    if (reader.peek() == ')') {
        reader.next();
        return { type: 'parenEnd', value: ')' };
    }

    return null;
}

const readCodeBlocks = reader => {
    if (reader.peek() == '{') {
        reader.next();
        return { type: 'codeBlockStart' };
    }

    if (reader.peek() == '}') {
        reader.next();
        return { type: 'codeBlockEnd' };
    }

    return null;
}

const readEndOfLine = reader => {
    if (reader.peek() == ';') {
        reader.next();
        return { type: 'endOfLine', value: ';' };
    }

    return null;
}

const readComma = reader => {
    if (reader.peek() == ',') {
        reader.next();
        return { type: 'comma', value: ',' };
    }

    return null;
}

const readWhitespace = reader => {
    const whitespaceRegex = /[\t\r\n ]/;
    let value = '';
    while(reader.hasNext() && reader.peek().match(whitespaceRegex)) {
        value += reader.peek();
        reader.next();
    }

    if (value.length > 0) {
        return {type: 'whitespace', value};
    }

    return null;
}

module.exports = [
    readNumberToken,
    readString,
    readOperator,
    readKeyword,
    readName,
    readParentheses,
    readCodeBlocks,
    readEndOfLine,
    readComma,
    readWhitespace,
];