// Copyright (c) Alvin Pivowar 2016

describe("lazy-pattern-proxy", () => {
    /*  class is defined in samples
        class LazyPattern {
            constructor(...args) {
                this.args = args;
                this.value = null;
            }

            get(factory, property, receiver) {
                if (property === "hasValue")
                    return !!this.value;

                if (!this.value)
                    this.value = Reflect.construct(factory, this.args);

                return (property === "value")
                    ? this.value
                    : Reflect.get(this.value, property, receiver);
            }
        }
    */

    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        get isOrigin() { return this.x === 0 && this.y === 0; }
    }

    it("lazy-hasValue", () => {
        let lazyPoint = new Proxy(Point, new LazyPattern());
        expect(lazyPoint.hasValue).toBeFalsy();
        expect(lazyPoint.isOrigin).toBeTruthy();
        expect(lazyPoint.hasValue).toBeTruthy();
    });

    it("lazy-constructor-params", () => {
        let lazyPoint = new Proxy(Point, new LazyPattern(3, 4));
        expect(lazyPoint.x).toBe(3);
        expect(lazyPoint.y).toBe(4);
    });
});