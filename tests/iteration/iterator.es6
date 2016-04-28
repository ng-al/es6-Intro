// Copyright (c) Alvin Pivowar 2016

describe("es6-iterator", () => {

    // EX: IE6-ITERATOR
    // iterator interface: {
    //      next: function,
    //      [done:  boolean,]
    //      [value: anything]
    // }

    it("char-iterator", () => {
        let charIterator = {
            nextIndex: 0,
            string: "ABCDE",

            next: function() {
                return (this.nextIndex === this.string.length)
                    ? { done: true }
                    : { done: false, value: this.string[this.nextIndex++] }
            }
        };

        expect(charIterator.next().value).toBe('A');
        expect(charIterator.next().value).toBe('B');
        expect(charIterator.next().value).toBe('C');
        expect(charIterator.next().value).toBe('D');
        expect(charIterator.next().value).toBe('E');
        expect(charIterator.next().done).toBeTruthy();
    });
});