{
    // PeggyJS allows us to run JS at the beginning to
    // define some functions at the top.
    // We will use it to define one function for all of our
    // binary operations since they need to resolve in the same way.
    const parseExpression = (head, tail) => {
        return tail.reduce(
            (result, element) => ({
                type: 'operation',
                operation: element[1],
                left: result, 
                right: element[3], 
            }), 
            head
        );
    }
}

// We need to have a different initial rule
// because we are parsing all statements at once
Program = _ head:LineStatement _ tail:(LineStatement _)* {
    return [
        head,
        ...tail.map(s => s[0])
    ];
}

// LineStatement -> IfExpressionStatement | AssignmentStatement | FunctionStatement
LineStatement = IfExpressionStatement / AssignmentStatement / FunctionStatement

// IfExpressionStatement -> IfKeyword PStart Expression PEnd CodeBlock
IfExpressionStatement "if statement" = IfKeyword _ PStart  _ check:Expression  _ PEnd _ statements:CodeBlock { return {
    type: 'if',
    check,
    statements
} }

// CodeBlock -> BStart LineStatement* BEnd
CodeBlock = BStart  _ statements:Program  _ BEnd { return statements; }

// FunctionStatement -> FunctionExpression Eol
FunctionStatement "function" = statement:FunctionExpression _ Eol { return statement; }

// FunctionExpression -> Name PStart FunctionParameters? PEnd
FunctionExpression = name:Name _ PStart  _ parameters:FunctionParameters?  _ PEnd { return {
    type: 'function',
    name,
    parameters
}; }

// FunctionParameters -> Expression (Comma Expression)*
// Since tail is an array of expressions each having a comma
// we need to map it to extract only the expression
FunctionParameters = head:Expression _ tail:( _ Comma  _ Expression)* { return [head, ...tail.map(p => p[3]) ]; }

// AssignmentStatement -> Name Equals Expression Eol
AssignmentStatement "assignment" = name:Name _ Equals  _ expression:Expression  _ Eol { return {
    type: 'assignment',
    name,
    expression
}; }

// Expression -> EqualityTerm ((And | Or) EqualityTerm)*
Expression = head:EqualityTerm _ tail:( _ (And / Or)  _ EqualityTerm)*  { return parseExpression(head, tail); }

// EqualityTerm -> RelationTerm ((DoubleEquals | NotEquals) RelationTerm)*
EqualityTerm = head:RelationTerm _ tail:( _ (DoubleEquals / NotEquals)  _ RelationTerm)*  { return parseExpression(head, tail); }

// RelationTerm -> AddSubTerm ((Less | Greater | LessEquals | GreaterEquals) AddSubTerm)*
RelationTerm = head:AddSubTerm _ tail:( _ (Less / Greater / LessEquals / GreaterEquals) _ AddSubTerm)*  { return parseExpression(head, tail); }

// AddSubTerm -> MulDivTerm ((Add | Subtract) MulDivTerm)*
AddSubTerm = head:MulDivTerm _ tail:( _ (Add / Subtract) _ MulDivTerm)*  { return parseExpression(head, tail); }

// MulDivTerm -> UnaryTerm ((Multiply | Divide) UnaryTerm)*
MulDivTerm = head:UnaryTerm _ tail:( _ (Multiply / Divide) _ UnaryTerm)* { return parseExpression(head, tail); }

// UnaryTerm -> Not? Factor
// optional value return null if they are not matched
UnaryTerm = withNot:Not? _ value:Factor { return {
    type: 'unary',
    withNot: withNot !== null,
    value
} }

// Factor -> GroupExpression | FunctionExpression | NumberExpression | VariableExpression | StringExpression
Factor = GroupExpression / FunctionExpression / NumberExpression / VariableExpression / StringExpression

// GroupExpression -> PStart Expression PEnd
GroupExpression = PStart _ Expression _ PEnd

// VariableExpression -> Name
VariableExpression = name:Name { return {
    type: 'variable',
    name
} }

// NumberExpression -> Number
NumberExpression = value:Number { return {
    type: 'number',
    value
} }

// StringExpression -> String
StringExpression = value:String { return {
    type: 'string',
    value
} }

// String parsing
String
  = "'" chars:Characters* "'" { return chars.join('') }

// Characters unless ' or Escaped
Characters
  = !("'" / "\\") char:. { return char }
  / "\\" "'" { return "'" }


// Direct regex check for name
Name =  [a-z][a-zA-Z0-9]* { return text() }

// Direct number check for numbers
Number = [0-9]+ { return text() }

// Other rules which resolve to tokens by exact match
IfKeyword = "if"
And = "&&"
Or = "||"
Not = "!"
DoubleEquals = "=="
NotEquals = "!="
Less = "<"
Greater = ">"
LessEquals = "<="
GreaterEquals = ">="
Multiply = "*"
Divide = "/"
Add = "+"
Subtract = "-"
Comma = ","
Equals = "="
PStart = "("
PEnd = ")"
BStart = "{"
BEnd = "}"
Eol = ";"

_ "whitespace"
  = [ \t\n\r]* { return null }