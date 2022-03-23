const parseExpression = require('./parse-expression');
const parseFunctionExpression = require('./parse-function');
const { parseOneOf, throwExpectedError, expectType } = require('./parser-helpers');

const parseStatements = reader => {
    const statements = [];

    while(reader.hasNext()) {
        statements.push(parseStatement(reader));

        if (reader.hasNext() && reader.getPreviousType() !== 'codeBlockEnd') {
            expectType('endOfLine', reader);
            reader.next();
        }
    }

    return statements;    
}

const parseStatement = reader => {
    const result = parseOneOf(reader, [
        parseIfExpression,
        parseFunctionCall,
        parseAssignment,
    ]);

    if (result) {
        return result;
    }

    throwExpectedError('statement', reader);
};

const parseAssignment = reader => {
    if (!reader.isType('name')) {
        return null;
    }

    const variable = reader.get().value;

    reader.next();

    if (!reader.isType('operator') || !reader.isValue('=')) {
        return null;
    }

    reader.next();

    const value = parseExpression(reader);

    return { 
        type: 'assignment', 
        variable, 
        value 
    };
}

const parseIfExpression = reader => {
    if (!reader.isTypeValue('keyword', 'if')) {
        return null;
    }

    reader.next();

    expectType('parenStart', reader);
    reader.next();

    const expression = parseExpression(reader);

    expectType('parenEnd', reader);
    reader.next();
    expectType('codeBlockStart', reader);
    reader.next();

    const statements = parseCodeBlockStatements(reader);

    expectType('codeBlockEnd', reader);
    reader.next();

    return {
        type: 'if',
        check: expression,
        statements
    };
}

const parseCodeBlockStatements = reader => {
    const statements = [];

    while (reader.hasNext() && !reader.isType('codeBlockEnd')) {
        statements.push(parseStatement(reader));

        if (reader.hasNext()) {
            expectType('endOfLine', reader);
            reader.next();
        }
    }

    return statements;
}

const parseFunctionCall = reader => parseFunctionExpression(reader, parseExpression);

module.exports = parseStatements;