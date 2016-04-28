// Copyright (c) Alvin Pivowar 2016

//  EX: LN6-FEATURES

describe("es6-number-features", () => {
    it("number-epsilon", () => {
        let n1 = 0.1;
        let n2 = 0.2;
        let sum = n1 + n2;

        const compareWithEpsilon = (n1, n2) => Math.abs(n1 - n2) <= Number.EPSILON;

        expect(sum === 0.3).toBeFalsy();
        expect(compareWithEpsilon(sum, 0.3)).toBeTruthy();
    });

    it("number-new-is-functions", () => {
        let fixed = 12.34;
        let integer = 12;
        let nan = NaN;
        let unsafeInteger = Number.MAX_SAFE_INTEGER + 1;

        expect(Number.isFinite(fixed)).toBeTruthy();
        expect(Number.isFinite(null)).toBeFalsy();  // es5 isFinite(null) returns true.

        expect(Number.isInteger(fixed)).toBeFalsy();
        expect(Number.isInteger(integer)).toBeTruthy();

        expect(Number.isNaN("hello")).toBeFalsy();  // es5 isNan(string) returns true.
        expect(Number.isNaN(nan)).toBeTruthy();

        expect(Number.isSafeInteger(integer)).toBeTruthy();
        expect(Number.isSafeInteger(unsafeInteger)).toBeFalsy();
    });

    it("number-new-math-functions", () => {
        expect(Math.cbrt(27)).toBe(3);                      // cube root
        expect(Math.expm1(1)).toBe(1.718281828459045);      // e ^ x - 1
        expect(Math.log10(100)).toBe(2);                    // log base 10
        expect(Math.log1p(9)).toBe(2.302585092994046);      // log base e of (1 + n)
        expect(Math.log2(8)).toBe(3);                       // log base 2

        expect(Math.sinh(12 + 34) === Math.sinh(12) * Math.cosh(34) + Math.cosh(12) * Math.sinh(34)).toBeTruthy();
        expect(Math.asinh(12) === 1 / Math.sinh(12));
        expect(Math.acos(34) === 1 / Math.acosh(34));

        expect(Math.tanh(12) === Math.sinh(12) / Math.cosh(12)).toBeTruthy();
        expect(Math.atanh(0)).toBe(0);

        // 3 ^ 2 + 4 ^ 2 == 5 ^2
        expect(Math.hypot(3, 4)).toBe(5);


        expect(Math.clz32(1)).toBe(31);                     // The number of leading zeroes in a 32-bit result.
        expect(Math.clz32(1000)).toBe(22);

        expect(Math.fround(12.34)).toBe(12.34000015258789); // Return the nearest single-precision number.

        expect(Math.imul(0xfffffffe, 5)).toBe(-10);         // 32 bit multiply

        expect(Math.sign(-12)).toBe(-1);                    // Sign of the number
        expect(Math.sign(0)).toBe(0);
        expect(Math.sign(34)).toBe(1);

        expect(Math.trunc(12.34)).toBe(12);                 // Return the integer portion of a number.
    });

    it("number-notation", () => {
        let binary = 0b1111011;
        let decimal = 123;
        let octal = 0o173;  // Also can be 0173 (Not recommended.)
        let hex = 0x7B;     // Not new in es6.

        expect(binary).toBe(123);
        expect(decimal).toBe(123);
        expect(octal).toBe(123);
        expect(hex).toBe(123);
    });
});