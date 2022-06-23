const {
    rule,
    oneOf,
    allOf,
    optional,
    zeroOrMore,
    oneOrMore,
    token,
} = require('./rule-helpers');

// Tokens
const Equals = token('operator', '=');
const Number = token('number', null, reader => ({type: 'number', value: reader.getValue() }));
const String = token('string', null, reader => ({type: 'string', value: reader.getValue() }));
const Name = token('name', null, reader => reader.getValue());
const PStart = token('parenStart');
const PEnd = token('parenEnd');
const BStart = token('codeBlockStart');
const BEnd = token('codeBlockEnd');
const Comma = token('comma');
const Eol = token('endOfLine');
const IfKeyword = token('keyword', 'if');

const Expression = oneOf(Number, String);

// CodeBlock -> BStart StatementList BEnd
const CodeBlock = rule(
    () => allOf(BStart, zeroOrMore(Statement), BEnd),
    ([, statements]) => statements
);

// IfExpression -> IfKeyword PStart Expression PEnd CodeBlock
const IfExpression = rule(
    () => allOf(IfKeyword, PStart, Expression, PEnd, CodeBlock),
    ([,, check,, statements]) => ({ type: 'if', check, statements })
)

// Assignment -> Name Equals Expression Eol
const Assignment = rule(
    () => allOf(Name, Equals, Expression, Eol), 
    ([name, _, expression]) => ({ type: 'assignment', name, value: expression })
);

// FunctionParameters -> Expression (Comma Expression)*
const FunctionParameters = rule(
    () => allOf(Expression, zeroOrMore(allOf(Comma, Expression))),
    ([first, rest]) => [
        first,
        ...rest.map(([_, parameter]) => parameter)
    ]
);

// Name PStart FunctionParameters? PEnd Eol
const FunctionCall = rule(
    () => allOf(Name, PStart, optional(FunctionParameters), PEnd, Eol),
    ([name, _, parameters]) => ({ 
        type: 'function', 
        name: name, 
        parameters: parameters.type !== 'optional' ? parameters : [] 
    })
);

// Statement -> IfExpression | FunctionCall | Assignment
const Statement = oneOf(IfExpression, Assignment, FunctionCall);

module.exports = Statement;