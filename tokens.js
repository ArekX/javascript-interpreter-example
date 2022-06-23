const readNumberToken = reader => {
    let numberText = '';
    const numberMatch = /\d/; // Regex for detecing a digit.

    // We read until we characters to read.
    while (reader.hasNext()) {
        if (reader.peek().match(numberMatch)) {
            // If a number matches the regex we add the
            // character to our string
            numberText += reader.peek();
            reader.next();
        } else {
            // if number is not matched we do not need to search anymore.
            break;
        }
    }

    if (numberText.length == 0) {
        // if no number was detected, return null meaning no token detected.
        return null;
    }

    // We found the token and we return type and value of the token.
    return { type: 'number', value: numberText };
}

const readString = reader => {
    let value = '';
    let startedReading = false; // Flag if we started reading a string
    let isEscaping = false; // Flag if we need to ignore the next character.

    // We read until we characters to read.
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

        // Add the character to our detected string.
        value += reader.peek();
        reader.next(); // Move the reader to a next character.
        isEscaping = false; // Reset escape flag so that we do not escape the next character.
    }

    if (value.length == 0) {
        return null; // if no string token was found
    }

    // return token of type string
    return { type: 'string', value };
}

const readOperator = reader => {
    // Regex for operator characters we want to detect.
    const operatorMatch = /^(!|\+|-|\*|\/|==|!=|&&|\|\||<|>|<=|>=|=|!=)$/;

    // Peek one character to detect one character operator
    const oneCharacterOperator = reader.peek();

    // Peek one character to detect two characters operator
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
        // Operator is found, we return the token.
        return { type: 'operator', value };
    }

    // Nothing was found so we return null that the token was not found.
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
        // We detected if keywords and return the token.
        reader.next(2);
        return { type: 'keyword', value: 'if' };
    }

    // No keyword detected
    return null;
}

const readParentheses = reader => {
    if (reader.peek() == '(') {
        // We detected '(', start of parentheses
        reader.next();
        return { type: 'parenStart', value: '(' };
    }

    if (reader.peek() == ')') {
        // We detected ')', end of parentheses
        reader.next();
        return { type: 'parenEnd', value: ')' };
    }

    // No token was detected.
    return null;
}

const readCodeBlocks = reader => {
    if (reader.peek() == '{') {
        // We detected '{', start of code block
        reader.next();
        return { type: 'codeBlockStart' };
    }

    if (reader.peek() == '}') {
        // We detected '}', end of code block
        reader.next();
        return { type: 'codeBlockEnd' };
    }

    // No token was detected.
    return null;
}

const readEndOfLine = reader => {
    if (reader.peek() == ';') {
        // Semicolon is detected
        reader.next();
        return { type: 'endOfLine', value: ';' };
    }

    // Semicolon is not detected
    return null;
}

const readComma = reader => {
    if (reader.peek() == ',') {
        // Comma was detected
        reader.next();
        return { type: 'comma', value: ',' };
    }

    // Token was not detected.
    return null;
}

const readWhitespace = reader => {
    const whitespaceRegex = /[\t\r\n ]/; // Regex for detecting whitespace.
    let value = '';
    while (reader.hasNext() && reader.peek().match(whitespaceRegex)) {
        // add detected whitespace to the value
        value += reader.peek();
        reader.next();
    }

    if (value.length > 0) {
        // Return detected whitespace.
        return { type: 'whitespace', value };
    }

    // No whitespace token was detected.
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