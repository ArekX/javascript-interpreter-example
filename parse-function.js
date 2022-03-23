const {expectType } = require('./parser-helpers');

const parseFunctionExpression = (reader, parseExpression) => {
    if (!reader.isType('name')) {
        return null;
    }

    const name = reader.getValue();
    reader.next();

    if (!reader.isType('parenStart')) {
        return null;
    }

    reader.next();

    const parameters = [];

    let hasMoreParameters = true;

    if (reader.isType('parenEnd')) {
        hasMoreParameters = false;
    }

    while (hasMoreParameters) {
        const expression = parseExpression(reader);

        parameters.push(expression);

        if (reader.isType('comma')) {
            reader.next();
            continue;
        }

        hasMoreParameters = false;
    }

    expectType('parenEnd', reader);
    reader.next();

    return {
        type: 'function',
        name,
        parameters
    };
}

module.exports = parseFunctionExpression;