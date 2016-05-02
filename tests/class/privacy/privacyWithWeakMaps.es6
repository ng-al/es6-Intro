// Copyright (c) Alvin Pivowar 2016

// Privacy with WeakMaps IS a successful method for class privacy.

describe("class-privacy-with-weakMaps", () => {

    // The intent is that a "framework" creates the items for public consumption.
    // Each item has a unique ID.
    // The public has access to a "special" property $id.
    // The class (internally) uses a WeakMap to hold the private key(s) of the class.
    // Each instance of the class has a Map of private keys within the WeakMap.
    // When there are no more references to an instance of the class, the WeakMap will garbage collect the private data.
    // We use a closure to make the WeakMap invisible to the public;
    const Item = (λ => {
        const privateData = new WeakMap();

        return class {
            constructor(id) {
                privateData.set(this, new Map());
                privateData.get(this).set("id", id);
            }

            get $id() { return privateData.get(this).get("id"); }
        };
    })();


    it("privacy-with-weakMap-test", () => {
        const item = new Item(123);
        expect(item.$id).toBe(123);

        // It is not possible to modify the internal ID.
    });
});