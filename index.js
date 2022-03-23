const run = require('./runner');

const code = `
firstName = 'John';
lastName = 'Smith';
age = 50;

print('Entered name: ' + firstName + ', ' + lastName, 2);

if (age > 40 && checkName(firstName, 'John')) {
    if (age > 45) {
        print('Age is above 45');
    }
    print('Welcome, ' + firstName + ' you are ' + age + ' old.');
}
`;

const vm = {
    variables: {},
    functions: {
        print(text) {
            console.log('Printing:', text, ':)');
        },
        checkName(name, val) {
            return name === val;
        }
    }
};

run(code, vm);