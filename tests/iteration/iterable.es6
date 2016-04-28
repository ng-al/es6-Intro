// Copyright (c) Alvin Pivowar 2016

describe("es6-iterator", () => {

    //  EX: IA6-ITERABLE
    // iterator interface: {
    //      next: fn that returns {next: function, [done: boolean,] [value: anything]}
    // }

    // iterable interface {
    //      [Symbol.iterator]: function that returns iterator
    // }

    it("char-iterable", () => {
        let charIterable = {
            string: "ABCDE",

            [Symbol.iterator]: function() {
                return {
                    array: this.string,
                    nextIndex: 0,

                    next: function() {
                        return (this.nextIndex === this.array.length)
                            ? { done: true }
                            : { done: false, value: this.array[this.nextIndex++] }
                    }
                }
            },

            // Not an iterator (or iterable)
            forEach: function(fn) {
                for (let i = 0; i < this.string.length; ++i)
                    fn(this.string[i], i, this.string);
            }
        };

        let iterable = charIterable[Symbol.iterator]();

        expect(iterable.next().value).toBe('A');
        expect(iterable.next().value).toBe('B');
        expect(iterable.next().value).toBe('C');
        expect(iterable.next().value).toBe('D');
        expect(iterable.next().value).toBe('E');
        expect(iterable.next().done).toBeTruthy();

        let result = "";
        for (let c of charIterable) {       // generator comprehension
            result += c;
        }
        expect(result).toBe("ABCDE");

        result = "";
        charIterable.forEach(c => result += c);
        expect(result).toBe("ABCDE");
    });
});