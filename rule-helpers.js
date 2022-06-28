// Rule function which returns a function which
// works on a token reader.
const rule = (getChecks, onMatch) => reader => {
    // Run getChecks to get rule check for a reader.
    // We need this to be a function so that we 
    // can reorder the rules as we see fit otherwise
    // we run into problems with Javascript not letting
    // us to use constants before it is defined.
    const checkRule = getChecks();

    // Run the retrieved rule checks on the reader.
    const result = checkRule(reader);

    // If result is not null that means that we found
    // a match and we run onMatch function on the result
    // to allow the rule to transform the result into
    // value which is good enough for our interpreter.
    //
    // If a result is null, this rule was not matched.
    return result ? onMatch(result) : null;
};

// Exactly is a function which returns a function
// which exactly runs each of the checks against
// a reader. If just one of the checks fail
// the whole function will return a null meaning
// that we couldn't match anything.
const exactly = (...checks) => reader => {
    // First we store the current position in the  
    // token list so that we can go back if we don't
    // match what we need.
    reader.pushState();

    const results = [];

    for (const check of checks) {

        const match = check(reader); // Run the check against the reader

        if (!match) {
            // Didn't get a match so we
            // restore the position in the token
            // and exit the function returning null, meaning no match.
            reader.restoreState();
            return null;
        }

        // We found a match so we add it to our
        // results list
        results.push(match);
    }

    // We drop the state we saved because we found all matches
    // by this point so we do not need the
    // saved state anymore.
    reader.popState();

    // We return the matched items
    // so that they can be transformed as needed.
    return results;
};

const either = (...checks) => reader => {
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

// Optional function returns a function which works on a
// token reader, runs a check and returns a value
// denoted by defaultValue if the check does not match.
// Returning a defaultValue other than a null allows optional
// to always return something even if the check fails
// thus making the check optional. :)
const optional = (check, defaultValue = { type: 'optional' }) => reader => {
    reader.pushState(); // we store the state before the check
    const result = check(reader);

    if (!result) {
        // Our check failed
        // so we restore the previous state
        reader.restoreState();
    } else {
        // we had a match so we
        // dont need to keep the stored state anymore
        reader.popState();
    }

    // Here we return the match or the default value
    // as long as default value is not null this would
    // make the result optional.
    return result ? result : defaultValue;
};

// minOf returns a function which works on a token
// reader which performs a check for a minimum amount
// up to infinity if a check fails for a minimum
// amount, null is returned, anything after a minimum
// is optional.
const minOf = (minAmount, check) => reader => {
    reader.pushState(); // first we store the current state.

    const results = [];

    let result = null;

    while (true) {
        // we run checks as many times
        // as we can in this loop.
        result = check(reader);

        if (!result) {
            if (results.length < minAmount) {
                // result was not found and we
                // didn't reach the minimum
                // amount so the matching is a failure
                // and we restore state before
                // return a null.
                reader.restoreState();
                return null;
            }

            // We didn't find a match 
            // so we do not need to be
            // in this loop anymore so we exit it.
            break;
        }

        results.push(result);
    }

    // We reached the end here so
    // we do not need the state anymore
    // so we remove it and return the results.
    reader.popState();
    return results;
};

// Token function returns a function
// which works on a token reader, 
// checks the type of the token and (if specified)
// a value of the token.
const token = (type, value = null) => reader => {
    // first we check if we have
    // a value set and value matches
    // in our token reader
    // if we didn't set a value parameter this 
    // variable is always true.
    let valueMatches = value ? reader.isValue(value) : true;

    if (reader.isType(type) && valueMatches) {
        // Our type is correct and value matches
        // so we return the matched token at this point.
        const result = reader.get();

        // this is also the only time we move to the
        // next token in the list, and it is because of this
        // that we need to push and pop the reader state
        // because if we do not go back on failures, we will not be
        // able to match everything correctly
        reader.next();

        // And finally we return the token result.
        return result;
    };

    // Here we didn't find a token we are looking for,
    // so we return a null.
    return null;
};

module.exports = {
    rule,
    exactly,
    either,
    optional,
    minOf,
    token,
};