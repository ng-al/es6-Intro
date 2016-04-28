// Copyright (c) Alvin Pivowar 2016

//  EX: LS6-SYMBOLS

describe("es6-symbol-features", () => {
    it("symbol-creation", () => {
        const s1 = Symbol();
        const s2 = Symbol("smedley");

        expect(typeof(s1)).toBe("symbol");
        expect(s2.toString().startsWith("Symbol(smedley)")).toBeTruthy();
        expect(Symbol() === Symbol()).toBeFalsy();
    });

    it("symbol-properties", () => {
        const s1 = Symbol();
        const s2 = Symbol("smedley");

        let o1 = {
            title: "object with both string and symbol keys",
            12: "integers work as keys",
            [s1]: "Use the computed property syntax to use symbols as keys",
            [s2]: 34
        };

        expect(o1[s2]).toBe(34);
    });

    it("symbol-registry", () => {
        const alpha = Symbol.for('α');
        const beta = Symbol.for('β');

        let o1 = {[alpha]: 12, [beta]: 34};

        expect(o1[alpha]).toBe(12);
        expect(o1[Symbol.for('β')]).toBe(34);
    });
});