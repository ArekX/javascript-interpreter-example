const rule = (checksGetter, onMatch) => reader => {
    const result = checksGetter()(reader);
    return result ? onMatch(result) : null;
};

const allOf = (...checks) => reader => {
    reader.pushState();
    const results = [];

    for (const check of checks) {

        const match = check(reader);
        if (!match) {
            reader.restoreState();
            return null;
        }

        results.push(match);
    }

    reader.popState();
    return results;
};

const oneOf = (...checks) => reader => {
    for (const check of checks) {
        reader.pushState();

        const match = check(reader);
        if (match) {
            reader.popState();
            return match;
        }

        reader.restoreState();
    }

    return null;
};

const optional = check => reader => {
    reader.pushState();
    const result = check(reader);
    return result ? result : { type: 'optional', ignoreNext: true };
};

const zeroOrMore = check => reader => checkWhileMatched(check, reader);

const checkWhileMatched = (check, reader) => {
    const results = [];

    reader.pushState();
    
    let result = null;

    do {
        result = check(reader);

        if (result) {
            results.push(result);
        }

    } while (result);

    if (results.length === 0) {
        reader.restoreState();
        return null;
    }

    reader.popState();
    return results;
};

const oneOrMore = check => reader => {
    reader.pushState();

    const first = check(reader);

    if (!first) {
        reader.restoreState();
        return null;
    }

    const otherResults = checkWhileMatched(check, reader);

    return [first, ...(otherResults ? otherResults : [])];
};

const token = (type, value = null, onMatch = null) => reader => {
    
    if (reader.isType(type) && (value ? reader.isValue(value) : true)) {
        const result = onMatch ? onMatch(reader) : reader.get();
        reader.next();
        return result;
    };

    return null;
};

module.exports = {
    rule,
    allOf,
    oneOf,
    optional,
    zeroOrMore,
    oneOrMore,
    token,
};