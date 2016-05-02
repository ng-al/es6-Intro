// Copyright (c) Alvin Pivowar 2016

// Privacy by privilege IS a successful method for class privacy.

describe("class-privacy-by-privilege", () => {
    // The intent is that a "framework" creates the items for public consumption.
    // Each item has a unique ID.
    // The public has access to a "special" property $id.
    // By using the constructor as a closure, we can hide the internal ID.
    // However, creating the getter is messy.
    class Item {
        constructor(id) {
            Reflect.defineProperty(this, "$id", {
                enumerable: true,
                get: λ => id,
                set: undefined
            });
        }
    }

    it("privacy-by-privilege-test", () => {
        const item = new Item(123);
        expect(item.$id).toBe(123);

        // The internal ID, (and the setter) are NOT accessible.

        item._id = 456;     // The class doesn't use _id, we are creating a new property.
        expect(item.$id).toBe(123);

        expect(λ => { item.$id = 456; }).toThrow();
    });
});