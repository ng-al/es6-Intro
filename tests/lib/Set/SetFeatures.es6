// Copyright (c) Alvin Pivowar 2016

describe("es6-sets", () => {

    //  EX: LS6-CONSTRUCTION

    it("set-construction", () => {
        let set1 = new Set();
        set1.add("Black");
        set1.add("Brown");
        set1.add("Red");
        expect(set1.size).toBe(3);

        let s2 = new Set()
            .add("Orange")
            .add("Yellow")
            .add("Green")
            .add("Blue");
        expect(s2.size).toBe(4);

        let s3 = new Set(["Violet", "Grey", "White"]);
        expect(s3.size).toBe(3);
    });

    //  EX: LS6-METHODS

    it("set-methods", () => {
        // clear
        let s1 = new Set([1, 2, 3]);
        expect(s1.size).toBe(3);
        s1.clear();
        expect(s1.size).toBe(0);

        // delete
        let s2 = new Set([1, 2, "delete me", 3]);
        expect(s2.size).toBe(4);
        s2.delete("delete me");
        expect(s2.size).toBe(3);

        // has
        let s3 = new Set([Math.E, Math.LN2, Math.PI]);
        expect(s3.has(Math.PI)).toBeTruthy();
        expect(s3.has(Math.LN10)).toBeFalsy();
    });

    it("set-uniqueness", () => {
        let s1 = new Set([true, false, null]);
        expect(s1.size).toBe(3);
        s1.add(false);
        expect(s1.size).toBe(3);

        let s2 = new Set(["a", "a", "a", "a", "a"]);
        expect(s2.size).toBe(1);

        let s3 = new Set([{}, {}, {}, {}, {}]);
        expect(s3.size).toBe(5);
    });

    //  EX: LS6-ITERABLE

    it ("sets-are-iterable", () => {
        let s1 = new Set(["Red", "Green", "Blue"]);

        let a1 = [];
        s1.forEach(item => a1.push(item));

        let a2 = [...s1];
        expect(a1).toEqual(a2);

        // Like Arrays, Sets have entries(), keys(), and values()

        // Sets do not have the map function, but ...
        let s2 = new Set([...s1].map(item => item+ 's'));
        expect(JSON.stringify(s2)).toBe('["Reds","Greens","Blues"]');
    });

    //  EX: LS6-WEAK_SET

    it("weak-set", () => {
        expect(() => new WeakSet([1])).toThrow();   // Only object references area allowed.

        let o = {};
        let ws1 = new WeakSet([o]);
        expect(ws1.has(o)).toBeTruthy();

        let ws2 = new WeakSet();
        const addToSet = λ => ws2.add(o);
        addToSet();
        setTimeout(λ => expect(ws2.has(o)).toBeFalsy(), 100);   // Garbage collected

        expect(ws2.size).toBeUndefined();   // Weak Sets are NOT iterable.
    });
});