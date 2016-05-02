// Copyright (c) Alvin Pivowar 2016

// Privacy by convention is NOT a successful method for class privacy.

describe("class-privacy-by-convention", () => {

    // The intent is that a "framework" creates the items for public consumption.
    // Each item has a unique ID.
    // The public has access to a "special" property $id.
    // The class (internally) uses _id as the location for the ID.  This is "intended" to be private.
    class Item {
        constructor(id) {
            this._id = id;
        }

        get $id() { return this._id; }
    }

    it("privacy-by-convention-test", () => {
        const item = new Item(123);
        expect(item.$id).toBe(123);

        // Not very private, is it?
        item._id = 456;
        expect(item.$id).toBe(456);
    });
});