// Copyright (c) Alvin Pivowar 2016

const LazyPattern = (λ => {
    const _args = new WeakMap();

    return class {
        constructor(...args) {
            _args.set(this, args);
            this.$value = null;
        }

        get(factory, property, receiver) {
            if (property === "$hasValue")
                return !!this.$value;

            if (!this.$value)
                this.$value = Reflect.construct(factory, _args.get(this));

            return (property === "$value")
                ? this.$value
                : Reflect.get(this.$value, property, receiver);
        }
    }
})();


describe("lazy-pattern-tests", () => {
    class IAmLazy {
        constructor() {
            this.p1 = "I am a property.";
        }

        get g1() { return "I am a getter."; }

        f1() { return "I am a function."; }
    }

    it("lazy-pattern-test", () => {
        const lazy = new Proxy(IAmLazy, new LazyPattern());

        expect(lazy.$hasValue).toBe(false);

        expect(lazy.p1).toBe("I am a property.");
        expect(lazy.g1).toBe("I am a getter.");
        expect(lazy.f1()).toBe("I am a function.");

        expect(lazy.$hasValue).toBe(true);
    });
});
