// Take an array of statements and interpret
// each of the statements and use the passed vm (we will explain this below)
const interpretStatements = (statements, vm) => {
    let result = null; // Set initial result for null

    for (const statement of statements) {
        // Interpret the statement and set the result.
        result = interpretStatement(statement, vm);
    }

    // Return last set result.
    return result;
};

// Interpret the statement itself with the passed vm
const interpretStatement = (statement, vm) => {
    switch (statement.type) { // We first check the statement type and run the corresponding function.
        case 'assignment':
            return interpretAssignment(statement, vm);
        case 'function':
            return interpretFunctionCall(statement, vm);
        case 'if':
            return interpretIf(statement, vm);
    }

    // We didn't get the correct type here of the statement so
    // that means something is wrong and we need to throw an error.
    throw new Error(`Invalid statement type: ${statement.type}`);
};

// Assignment just sets a variable as a result of expression.
const interpretAssignment = (statement, vm) => {
    vm.variables[statement.name] = interpretExpression(statement.expression, vm);

    // We also return the set variable as a statement result.
    // This is not strictly necessary, but we want
    // every statement to return something.
    return vm.variables[statement.name];
};

const interpretExpression = (expression, vm) => {
    // Similar to statements, we interpret expressions
    // based on the type.
    switch (expression.type) {
        case 'string':
            // For strings we just return them because
            // they are already ready.
            return expression.value;
        case 'number':
            // For numbers we convert them to actual numbers
            // so that they can be used further in expressions.
            return parseFloat(expression.value);
        case 'boolean':
            // For booleans we just return them since they already have a correct value.
            return expression.value;
        case 'variable': // For variables and the rest we will delegate them to their functions
            return interpretVariableRetrieval(expression, vm);
        case 'function':
            return interpretFunctionCall(expression, vm);
        case 'unary':
            return interpretUnaryOperation(expression, vm);
        case 'operation':
            return interpretBinaryOperation(expression, vm);
    }

    // We got the wrong type here so we throw an error
    // because something went wrong.
    throw new Error(`Invalid type: ${expression.type}`);
};

const interpretVariableRetrieval = (expression, vm) => {
    if (!(expression.name in vm.variables)) {
        // Variable is not defined so this is a runtime error which we need to throw.
        throw new Error(`Runtime Error. Variable '${expression.name}' does not exist.`);
    }

    // We return the variable's value from VM.
    return vm.variables[expression.name];
};

const interpretFunctionCall = (expression, vm) => {
    if (!(expression.name in vm.functions)) {
        // Function is not defined so this is a runtime error so we throw it.
        throw new Error(`Runtime Error. Function '${expression.name}' is not defined.`);
    }

    // We need to interpret an expression for each of the function parameters
    // so we perform it using a map call.
    const parameters = expression.parameters.map(
        parameter => interpretExpression(parameter, vm)
    );

    // And we call a function from VM an pass parameters by a spread operator.
    return vm.functions[expression.name](...parameters);
};

const interpretUnaryOperation = (expression, vm) => {
    const value = interpretExpression(expression.value, vm);

    return expression.withNot ? !value : value;
};

const interpretBinaryOperation = (expression, vm) => {
    // We interpret the expression for the left side of the operation
    const leftValue = interpretExpression(expression.left, vm);
    // And now for the right side
    const rightValue = interpretExpression(expression.right, vm);

    // And based on the operation we perform the same operation on the
    // left and right side to get the result we need.
    switch (expression.operation) {
        case '+':
            return leftValue + rightValue;
        case '-':
            return leftValue - rightValue;
        case '*':
            return leftValue * rightValue;
        case '/':
            return leftValue / rightValue;
        case '&&':
            return leftValue && rightValue;
        case '||':
            return leftValue || rightValue;
        case '>':
            return leftValue > rightValue;
        case '<':
            return leftValue < rightValue;
        case '<=':
            return leftValue <= rightValue;
        case '>=':
            return leftValue >= rightValue;
        case '==':
            return leftValue == rightValue;
        case '!=':
            return leftValue != rightValue;
    }

    // We didn't get a operation we expect so we throw an exception here.
    throw new Error(`Invalid operation requested: ${expression.operation}`);
};

const interpretIf = (statement, vm) => {
    // Interpret the check expression we are checking for
    const checkValue = interpretExpression(statement.check, vm);

    if (checkValue) {
        // Value is true so we interpret the if's own statements
        // and return the value.
        return interpretStatements(statement.statements, vm);
    } else if (statement.elseStatements.length > 0) {
        // Value is false and there are else statements 
        // so we interpret the if's else statements and return the value.
        return interpretStatements(statement.elseStatements, vm);
    }

    // If check failed so we just return null.
    return null;
};

module.exports = interpretStatements;