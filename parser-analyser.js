// We include the the grammar here.
// Grammar exports the very first rule: LineStatement
// That means that parseGrammar is actually same as LineStatement constant.
const parseGrammar = require('./grammar');
const TokenReader = require('./token-reader');

const parseTokens = tokens => {
    // Create a reader for our tokens.
    const reader = new TokenReader(tokens);

    const statements = [];

    while (reader.hasNext()) {
        // We parse grammar until we have a next token.
        const statement = parseGrammar(reader);

        if (statement) {
            // Our statement was parsed successfully,
            // so we add it to the list of statements.
            statements.push(statement);
            continue;
        }

        // Something went wrong here, we couldn't parse our statement here
        // so our language needs to throw a syntax error.
        let token = reader.hasNext() ? reader.get() : reader.getLastToken();
        throw new Error(`Syntax error on ${token.line}:${token.character} for "${token.value}". Expected an assignment, function call or an if statement.`);
    }

    // Return the parsed statements
    return statements;
};

module.exports = parseTokens;
