// Copyright (c) Alvin Pivowar 2016

// EX: LO6-DESTRUCTURING

describe("es6-object-features", () => {
    it("object-destructuring", () => {
        const MOE =  {
            firstName: "Moe",
            lastName: "Howard",
            realName: "Moses Harry Horwitz",
            born: "June 19, 1897",
            died: "May 4, 1975",
            causeOfDeath: "Lung Cancer",
            stoogeYears: "1921-1969"
        };

        let { firstName, lastName, stoogeYears } = MOE;
        expect(firstName).toBe("Moe");
        expect(lastName).toBe("Howard");
        expect(stoogeYears).toBe("1921-1969");

        let { firstName: first, middleName: middle = "(none)", lastName: last } = MOE;
        expect(first).toBe("Moe");
        expect(middle).toBe("(none)");
        expect(last).toBe("Howard");

        const CURLY = {
            firstName: "Curly",
            lastName: "Howard",
            realName: "Jerome Lester Horwitz",
            born: "October 22, 1903",
            died: "January 18, 1952",
            causeOfDeath: "Cerebral Hemorrhage",
            stoogeYears: "1932-1946"
        };

        const NAME_TYPES = ["first", "last", "real"];
        const NAME_PROPERTIES = NAME_TYPES.map(nt => nt + "Name");
        let { [NAME_PROPERTIES[0]]: x, [NAME_PROPERTIES[1]]: y, [NAME_PROPERTIES[2]]: z } = MOE;

        expect(x).toBe("Moe");
        expect(y).toBe("Howard");
        expect(z).toBe("Moses Harry Horwitz");

        MOE.punchTarget = CURLY;
        let {firstName: hitter, punchTarget: {firstName : hittee}} = MOE;
        expect(hitter).toBe("Moe");
        expect(hittee).toBe("Curly");
    });

    it("property-initialization", () => {
        let name = "Smedley";
        let rank = "Private";
        let serialNumber = "123-45-6789";

        let soldier = { name, rank, serialNumber };

        expect(soldier.name).toBe(name);
        expect(soldier.rank).toBe(rank);
        expect(soldier.serialNumber).toBe(serialNumber);
    });

    it("function-initialization", () => {
        let name = {
            firstName: "Smedley",
            lastName: "Smith",

            fullNameFn() {
                return `${this.firstName} ${this.lastName}`;
            },

            fullNameLambda: n => `${n.firstName} ${n.lastName}`
        };

        expect(name.fullNameFn()).toBe("Smedley Smith");
        name.fullNameLambda(name);
    });

    //  EX: LO6-COMPUTED

    it("computed-property-names", () => {
        let fullName = "Smedley Smith";
        let [firstName, lastName] = fullName.split(' ');
        let p1 = { type: "first", name: firstName};
        let p2 = { type: "last", name: lastName};

        let name = {
            [p1.type + "Name"]: p1.name,
            [p2.type + "Name"]: p2.name
        };

        expect(name.firstName).toBe("Smedley");
        expect(name.lastName).toBe("Smith");
    });

    //  EX: LO6-METHODS

    it("object-methods", () => {
        // assign (cloning)
        let source1 = {a: 1};
        let clone = Object.assign({}, source1);
        expect(clone).toEqual(source1);

        // assign (merging)
        let source2 = {b: 2};
        let source3 = {c: 3};
        let merge = Object.assign(source1, source2, source3);
        expect(merge).toEqual({a: 1, b: 2, c: 3});
        expect(source1).toEqual({a: 1, b: 2, c: 3});

        // is
        expect(0 === -0).toBeTruthy();
        expect(NaN === NaN).toBeFalsy();
        expect(Object.is(0, -1)).toBeFalsy();
        expect(Object.is(NaN, NaN)).toBeTruthy();

        // setProtoTypeOf
        let x = { a: λ => {} };
        let y = {};
        expect(y.a).toBeUndefined();
        Object.setPrototypeOf(y, x);
        expect(y.a).toBeDefined();
    });
});