const interpretStatements = (statements, vm) => {
    let result = null;

    for(const statement of statements) {
        result = interpretStatement(statement, vm);
    }

    return result;
};

const interpretStatement = (statement, vm) => {
    switch(statement.type) {
        case 'assignment': 
            return interpretAssignment(statement, vm);
        case 'function':
            return interpretFunctionCall(statement, vm);
        case 'if':
            return interpretIf(statement, vm);
    }

    throw new Error(`Invalid statement type: ${statement.type}`);
};

const interpretAssignment = ({variable, value}, vm) => {
    vm.variables[variable] = interpretAst(value);
    return vm.variables[variable];
};

const interpretAst = (item, vm) => {
    switch (item.type) {
        case 'string':
            return item.value;
        case 'number':
            return +item.value;
        case 'name':
            return interpretVariable(item, vm);
        case 'function':
            return interpretFunctionCall(item, vm);
        case 'unary':
            return interpretUnary(item, vm);
        case 'binary':
            return interpretBinary(item, vm);
        case 'ast':
            return interpretAst(item.value, vm);
    }

    throw new Error(`Invalid type: ${item.type}`);
};

const interpretUnary = ({operator, value}, vm) => {
    switch (operator) {
        case '-':
            return interpretAst(value, vm) * -1;
        case '!':
            return !interpretAst(value, vm);
    }

    throw new Error(`Invalid unary operator: ${operator}`);
};

const interpretBinary = (item, vm) => {
    const { operator, left, right } = item;
    switch (operator) {
        case '+':
            return interpretAst(left, vm) + interpretAst(right, vm);
        case '-':
            return interpretAst(left, vm) - interpretAst(right, vm);
        case '*':
            return interpretAst(left, vm) * interpretAst(right, vm);
        case '/':
            return interpretAst(left, vm) / interpretAst(right, vm);
        case '&&':
            return interpretAst(left, vm) && interpretAst(right, vm);
        case '||':
            return interpretAst(left, vm) || interpretAst(right, vm);
        case '>':
            return interpretAst(left, vm) > interpretAst(right, vm);
        case '<':
            return interpretAst(left, vm) < interpretAst(right, vm);
        case '<=':
            return interpretAst(left, vm) <= interpretAst(right, vm);
        case '>=':
            return interpretAst(left, vm) >= interpretAst(right, vm);
        case '==':
            return interpretAst(left, vm) == interpretAst(right, vm);
        case '!=':
            return interpretAst(left, vm) != interpretAst(right, vm);
    }

    throw new Error(`Invalid operator: ${operator}`);
}

const interpretVariable = ({value}, vm) => {
    if (!(value in vm.variables)) {
        throw new Error(`Variable '${value}' is not defined.`);
    }

    return vm.variables[value];
}

const interpretFunctionCall = ({name, parameters}, vm) => {
    if (!(name in vm.functions)) {
        throw new Error(`Function '${name}' is not defined.`);
    }

    return vm.functions[name](...parameters.map(parameterAst => interpretAst(parameterAst, vm)));
};

const interpretIf = ({check, statements}, vm) => {
    const matches = interpretAst(check, vm);

    if (matches) {
        return interpretStatements(statements, vm);
    }

    return null;
};

module.exports = interpretStatements;