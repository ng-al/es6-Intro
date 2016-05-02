// Copyright (c) Alvin Pivowar 2016

// Privacy with symbols is NOT a successful method for class privacy.

describe("class-privacy-with-symbols", () => {

    // The intent is that a "framework" creates the items for public consumption.
    // Each item has a unique ID.
    // The public has access to a "special" property $id.
    // The class (internally) uses a symbol as the key for the internal ID.
    // The "intent" is to make the internal ID private.
    // We use a closure to make the symbol invisible to the public;
    const Item = (λ => {
        const idSymbol = Symbol();

        return class {
            constructor(id) {
                this[idSymbol] = id;
            }

            get $id() { return this[idSymbol]; }
        };
    })();


    it("privacy-with-symbols-test", () => {
        const item = new Item(123);
        expect(item.$id).toBe(123);

        // More difficult, but not private.
        const theNotSoPrivateSymbol = Object.getOwnPropertySymbols(item)[0];
        item[theNotSoPrivateSymbol] = 456;
        expect(item.$id).toBe(456);
    });
});