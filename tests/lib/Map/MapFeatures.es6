// Copyright (c) Alvin Pivowar 2016

describe("es6-map-features", () => {

    //  EX: LM6-CONSTRUCTION

    it("map-construction", () => {
        let m1 = new Map();
        m1.set(0x000000, "Black");
        m1.set(0xA52A2A, "Brown");
        m1.set(0xFF0000, "Red");
        expect(m1.size).toBe(3);

        let m2 = new Map([
            [0xFFA500, "Orange"],
            [0xFFFF00, "Yellow"],
            [0x00FF00, "Green"],
            [0x0000FF, "Blue"]
        ]);
        expect(m2.size).toBe(4);
    });

    //  EX: LM6-METHODS

    it("map-methods", () => {
        let colors = new Map([
            [0x000000, "Black"],
            [0xA52A2A, "Brown"],
            [0xFF0000, "Red"],
            [0xFFA500, "Orange"],
            [0xFFFF00, "Yellow"],
            [0x00FF00, "Green"],
            [0x0000FF, "Blue"],
            [0xEE82EE, "Violet"],
            [0x808080, "Grey"],
            [0xFFFFFF, "White"]
        ]);

        // clear
        let m2 = new Map([...colors]);
        expect(m2.size).toBe(10);
        m2.clear();
        expect(m2.size).toBe(0);

        // delete
        expect(colors.has(0xC0C0C0)).toBeFalsy();
        colors.set(0xC0C0C0, "Silver");
        expect(colors.has(0xC0C0C0)).toBeTruthy();
        colors.delete(0xC0C0C0);
        expect(colors.has(0xC0C0C0)).toBeFalsy();

        // get
        let color = colors.get(0xFFA500);
        expect(color).toBe("Orange");
        color = colors.get(0xC0C0C0);
        expect(color).toBeUndefined();

        // has
        expect(colors.has(0xFFA500)).toBeTruthy();
        expect(colors.has(0xC0C0C0)).toBeFalsy();

        // set
        colors.set(0xC0C0C0, "Silver");
        color = colors.get(0xC0C0C0);
        expect(color).toBe("Silver");

        // size
        expect(colors.size).toBe(11);
        colors.delete(0xC0C0C0);
        expect(colors.size).toBe(10);
    });

    // EX:  LM6-ITERABLE

    it("maps-are-iterable", () => {
        let colors = new Map([
            [0x000000, "Black"],
            [0xA52A2A, "Brown"],
            [0xFF0000, "Red"],
            [0xFFA500, "Orange"],
            [0xFFFF00, "Yellow"],
            [0x00FF00, "Green"],
            [0x0000FF, "Blue"],
            [0xEE82EE, "Violet"],
            [0x808080, "Grey"],
            [0xFFFFFF, "White"]
        ]);

        colors.forEach((value, key) => {
            expect(colors.get(key)).toBe(value);
        });

        for (let [key, value] of colors) {
            expect(colors.get(key)).toBe(value);
        }

        // Like Arrays, Maps have entries(), keys(), and values()
    });

    it("weak-maps", () => {
        expect(λ => new WeakMap([[0x000000, "Black"]])).toThrow();  // Only objects are allowed for keys.

        let o = {};
        let wm1 = new WeakMap([[o, 12]]);
        expect(wm1.has(o)).toBeTruthy();

        let wm2 = new WeakMap();
        const addToMap = λ => wm2.set(o, 34);
        addToMap();
        setTimeout(λ => expect(wm2.has(o)).toBeFalsy(), 100);   // Garbage collected

        expect(wm2.size).toBeUndefined();   // Weak Maps are NOT iterable.
    });
});