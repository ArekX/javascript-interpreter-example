const { parseOneOf, parseType, throwExpectedError } = require('./parser-helpers');
const parseFunctionExpression = require('./parse-function');

const parseExpression = reader => {
    const expression = parseLogicalOperators(reader);

    if (!expression) {
        throwExpectedError('expression', reader);
    }

    return {
        type: 'ast',
        value: expression
    }
}

const parseBinary = (reader, expectedOperators, parseHigherOrder) => {
    let expression = parseHigherOrder(reader);

    while (reader.hasNext() && expectedOperators.includes(reader.getValue())) {
        const operator = reader.getValue();

        reader.next();

        expression = {
            type: 'binary',
            operator,
            left: expression,
            right: parseHigherOrder(reader)
        };
    }

    return expression;
}

const parseLogicalOperators =  reader => parseBinary(reader, ['&&', '||'], parseEqualityOperator);
const parseEqualityOperator = reader => parseBinary(reader, ['==', '!='], parseRelationOperator);
const parseRelationOperator = reader => parseBinary(reader, ['>', '<', '>=', '<='], parseAdditionSubtractionOperator);
const parseAdditionSubtractionOperator = reader => parseBinary(reader, ['+', '-'], parseMultiplicationDivisionOperator);
const parseMultiplicationDivisionOperator = reader => parseBinary(reader, ['*', '/'], parseUnary);

const parseUnary = reader => parseOneOf(reader, [
    parseUnaryOperator,
    parseFunctionCall,
    parseParentheses,
    parseLiteral
]);

const unaryOperators = ['-', '+', '!']
const parseUnaryOperator = reader => {
    const unaryOperator = reader.getValue();

    if (reader.getType() === 'operator' && unaryOperators.includes(unaryOperator)) {
        reader.next();
        return {
            type: 'unary',
            operator: unaryOperator,
            value: parseUnaryExpression(reader)
        };
    }

    return null;
}

const parseParentheses = reader => {
    if (!reader.isType('parenStart')) {
        return null;
    }

    reader.next();

    reader.pushPosition();
    const result = parseExpression(reader);

    if (result && !reader.hasNext()) {
        throw new Error('Reached end of code without matching closing parentheses.');
    }

    if (result && reader.isType('parenEnd')) {
        reader.next();
        return result;
    }

    reader.popPosition();

    return null;
}

const parseFunctionCall = reader => parseFunctionExpression(reader, parseExpression);

const parseLiteral = reader => parseOneOf(reader, [
    parseNumber,
    parseString,
    parseName
]);

const parseNumber = reader => parseType(reader, 'number');
const parseString = reader => parseType(reader, 'string');
const parseName = reader => parseType(reader, 'name');

module.exports = parseExpression;