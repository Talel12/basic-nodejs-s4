const calculate = require('./calculate')


test('simple numbers test calculate/cal', () => {
    expect(calculate.cal(1,1)).toBe(2);
});


test('negative numbers test in calculate/cal', () => {
    expect(calculate.cal(-1,1)).toBe(0);
});


test('big numbers test in calculate/cal', () => {
    expect(calculate.cal(10000000000000000000000000000000000000000000000000000000000,10000000000000000000000000000000000000000000000000000000000)).toBe(2e+58);
});


test('Concat Strings test in calculate/cal', () => {
    expect(calculate.cal("abc","1")).toBe("abc1");
});