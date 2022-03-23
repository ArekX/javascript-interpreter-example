const parseOneOf = (reader, parsers) => {
    for (const parseToken of parsers) {
        reader.pushPosition();
        const token = parseToken(reader);

        if (token) {
            return token;
        }

        reader.popPosition();
    }

    return null;
}

const parseType = (reader, type, renameType = null) => {
    const value = reader.get();

    if (value.type === type) {
        reader.next();
        return { type: renameType || type, value: value.value };
    }

    return null;
}

const throwExpectedError = (expected, reader) => {
    let item = reader.get();

    if (!item) {
        item = {
            type: 'EOF',
            line: '-1',
            character: '-1'
        }
    }

    throw new Error(`Expected ${expected}, got ${item.type} at ${item.line}:${item.character}`);
}

const expectType = (type, reader) => {
    if (!reader.isType(type)) {
        throwExpectedError(type, reader);
    }
}

module.exports = {
    parseOneOf,
    parseType,
    throwExpectedError,
    expectType,
};