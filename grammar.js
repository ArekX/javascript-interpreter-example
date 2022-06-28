const { rule, either, exactly, optional, minOf, token } = require('./rule-helpers');

// LineStatement -> IfExpressionStatement | AssignmentStatement | FunctionStatement
const LineStatement = rule(
    () => either(IfExpressionStatement, AssignmentStatement, FunctionStatement),
    expression => expression
);

// IfExpressionStatement -> IfKeyword PStart Expression PEnd CodeBlock
const IfExpressionStatement = rule(
    () => exactly(IfKeyword, PStart, Expression, PEnd, CodeBlock),
    ([,, check,, statements]) => ({ type: 'if', check, statements })
)

// CodeBlock -> BStart LineStatement* BEnd
const CodeBlock = rule(
    () => exactly(BStart, minOf(0, LineStatement), BEnd),
    ([, statements]) => statements
);

// FunctionStatement -> FunctionExpression Eol
const FunctionStatement = rule(
    () => exactly(FunctionExpression, Eol),
    ([expression]) => expression
);

// FunctionExpression -> Name PStart FunctionParameters? PEnd
const FunctionExpression = rule(
    () => exactly(Name, PStart, optional(FunctionParameters, []), PEnd),
    ([name, _, parameters]) => ({
        type: 'function',
        name: name.value,
        parameters
    })
);

// FunctionParameters -> Expression (Comma Expression)*
const FunctionParameters = rule(
    () => exactly(Expression, minOf(0, exactly(Comma, Expression))),
    ([first, rest]) => [first, ...rest.map(([_, parameter]) => parameter)]
);

// AssignmentStatement -> Name Equals Expression Eol
const AssignmentStatement = rule(
    () => exactly(Name, Equals, Expression, Eol),
    ([name,, expression]) => ({ type: 'assignment', name: name.value, expression })
);

// We use this functions for all binary operations in the
// Expression rule because all of them parse the same way
// this will allow us to create nested operations.
const processBinaryResult = ([left, right]) => {
    let expression = left;

    // We need to go through all operators on the right side
    // because there can be 3 or more operators in an expression.
    for (const [operator, rightSide] of right) {

        // Each time we encounter an expression we put the
        // previous one in the left side.
        expression = {
            type: 'operation',
            operation: operator.value,
            left: expression,
            right: rightSide
        };
    }

    // Finally we return the expression structure.
    return expression;
};

// Expression -> EqualityTerm ((And | Or) EqualityTerm)*
const Expression = rule(
    () => exactly(EqualityTerm, minOf(0, exactly(either(And, Or), EqualityTerm))),
    processBinaryResult
);

// EqualityTerm -> RelationTerm ((DoubleEquals | NotEquals) RelationTerm)*
const EqualityTerm = rule(
    () => exactly(RelationTerm, minOf(0, exactly(either(DoubleEquals, NotEquals), RelationTerm))),
    processBinaryResult
);

// EqualityTerm -> AddSubTerm ((Less | Greater | LessEquals | GreaterEquals) AddSubTerm)*
const RelationTerm = rule(
    () => exactly(AddSubTerm, minOf(0, exactly(either(Less, Greater, LessEquals, GreaterEquals), AddSubTerm))),
    processBinaryResult
);

// AddSubTerm -> MulDivTerm ((Add | Subtract) MulDivTerm)*
const AddSubTerm = rule(
    () => exactly(MulDivTerm, minOf(0, exactly(either(Add, Subtract), MulDivTerm))),
    processBinaryResult
);

// MulDivTerm -> UnaryTerm ((Multiply | Divide) UnaryTerm)*
const MulDivTerm = rule(
    () => exactly(UnaryTerm, minOf(0, exactly(either(Multiply, Divide), UnaryTerm))),
    processBinaryResult
);

// UnaryTerm -> Not? Factor
const UnaryTerm = rule(
    () => exactly(optional(Not), Factor),
    ([addedNot, value]) => ({
        type: 'unary',
        withNot: addedNot.type !== 'optional',
        value
    })
);

// Factor -> GroupExpression | FunctionExpression | NumberExpression | VariableExpression | StringExpression
const Factor = rule(
    () => either(GroupExpression, FunctionExpression, NumberExpression, VariableExpression, StringExpression),
    factor => factor
);

// GroupExpression -> PStart Expression PEnd
const GroupExpression = rule(
    () => exactly(PStart, Expression, PEnd),
    ([, expression]) => expression
);

// VariableExpression -> Name
const VariableExpression = rule(
    () => Name,
    name => ({
        type: 'variable',
        name: name.value
    })
);

// NumberExpression -> Number
const NumberExpression = rule(
    () => Number,
    number => ({
        type: 'number',
        value: number.value
    })
);

// StringExpression -> String
const StringExpression = rule(
    () => String,
    string => ({
        type: 'string',
        value: string.value
    })
);

// Tokens
const Number = token('number');
const String = token('string');
const Name = token('name');
const Equals = token('operator', '=');
const PStart = token('parenStart');
const PEnd = token('parenEnd');
const BStart = token('codeBlockStart');
const BEnd = token('codeBlockEnd');
const Comma = token('comma');
const Eol = token('endOfLine');
const IfKeyword = token('keyword', 'if');
const And = token('operator', '&&');
const Or = token('operator', '||');
const DoubleEquals = token('operator', '==');
const NotEquals = token('operator', '!=');
const Less = token('operator', '<');
const Greater = token('operator', '>');
const LessEquals = token('operator', '<=');
const GreaterEquals = token('operator', '>=');
const Add = token('operator', '+');
const Subtract = token('operator', '-');
const Multiply = token('operator', '*');
const Divide = token('operator', '/');
const Not = token('operator', '!');

module.exports = LineStatement;