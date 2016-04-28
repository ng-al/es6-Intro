// Copyright (c) Alvin Pivowar 2016

describe("es6-generators", () => {
    // EX: IG6-GENERATORS

    it("char-generator", () => {
        function *letters() {       // generator function
            const string = "ABCDE";
            for (let i = 0; i < string.length; ++i)
                yield string[i];
        }

        let generator = letters();      // generator
        expect(generator.next().value).toBe('A');
        expect(generator.next().value).toBe('B');
        expect(generator.next().value).toBe('C');
        expect(generator.next().value).toBe('D');
        expect(generator.next().value).toBe('E');
        expect(generator.next().done).toBeTruthy();

        let result = "";
        for (let c of letters()) {      // generator comprehension
            result += c;
        }
        expect(result).toBe("ABCDE");
    });

    it("counter-generator", () => {
        function *positiveIntegers() {      // generator function
            let x = -1;
            while (true) {
                let v = 1 + x;
                x = (yield v) || v;
            }
        }

        let generator = positiveIntegers();     // generator
        expect(generator.next().value).toBe(0);
        expect(generator.next().value).toBe(1);
        expect(generator.next().value).toBe(2);
        expect(generator.next(10).value).toBe(11);
        expect(generator.next().value).toBe(12);

        generator = positiveIntegers();
        expect(λ => generator.throw("whoops!")).toThrow();
    });

    it("generator-yield*", () => {
        function *letters() {       // generator function
            yield 'A';
            yield 'B';
            yield* [..."XYZ"];      // generator comprehension
            yield 'C';
        }

        let generator = letters();      // generator
        expect(generator.next().value).toBe('A');
        expect(generator.next().value).toBe('B');
        expect(generator.next().value).toBe('X');
        expect(generator.next().value).toBe('Y');
        expect(generator.next().value).toBe('Z');
        expect(generator.next().value).toBe('C');
        expect(generator.next().done).toBeTruthy();
    });
});