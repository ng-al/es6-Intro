// Copyright (c) Alvin Pivowar 2016

describe("lazy-pattern-proxy", () => {
    // The LazyPattern class is defined in samples/LazyPattern.es6

    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        get isOrigin() { return this.x === 0 && this.y === 0; }
    }

    it("lazy-hasValue", () => {
        let lazyPoint = new Proxy(Point, new LazyPattern());
        expect(lazyPoint.$hasValue).toBeFalsy();
        expect(lazyPoint.isOrigin).toBeTruthy();
        expect(lazyPoint.$hasValue).toBeTruthy();
    });

    it("lazy-constructor-params", () => {
        let lazyPoint = new Proxy(Point, new LazyPattern(3, 4));
        expect(lazyPoint.x).toBe(3);
        expect(lazyPoint.y).toBe(4);
    });
});