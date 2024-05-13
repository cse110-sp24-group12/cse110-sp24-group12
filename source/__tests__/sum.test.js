const sum = require('../scripts/sum');

test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
});

test('sum test', () => {
    expect(sum(1, 2)).toBe(3);
});