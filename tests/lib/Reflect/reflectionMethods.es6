// Copyright (c) Alvin Pivowar 2016

describe("es6-reflection-methods", () => {

    // Reflect.apply(function, this, args)
    it("reflect-apply", () => {
        let adder = {
            number: 12,

            add: function(addend) {
                return this.number + (addend || 1);
            }
        };

        expect(adder.add()).toBe(13);
        expect(adder.add(34)).toBe(46);

        let hundred = {number: 100};

        expect(Reflect.apply(adder.add, adder)).toBe(13);
        expect(Reflect.apply(adder.add, adder, [34])).toBe(46);
        expect(Reflect.apply(adder.add, hundred)).toBe(101);
        expect(Reflect.apply(adder.add, hundred, [34])).toBe(134);
    });

    // Reflect.construct(target, args, constructor)
    it("reflect-construct", () => {
        function Adder(number1, number2) {
            this.number1 = number1;
            this.number2 = number2;

            this.op = function() { return this.number1 + this.number2; };
        }

        function Multiplier() {
            this.op = function() { return this.number1 * this.number2; };
        }

        let operation = Reflect.construct(Adder, [12, 34]);
        expect(operation.op()).toBe(46);

        //operation = Reflect.construct(Adder, [12, 34], Multiplier);
        //expect(operation.op()).toBe(408);
    });

    // Reflect.defineProperty(object, propertyName, descriptor)
    // descriptor (for data property): { configurable: boolean, enumerable: boolean, value: object, writable: boolean }
    // descriptor (for accessor property): { configurable: boolean, enumerable: boolean, get: function, set: function }

    it("reflect-defineProperty-data-properties", () => {
        let o1 = {};

        Reflect.defineProperty(o1, "p1", {
            enumerable: true,
            value: "I am property one.",
            writable: true
        });
        expect(Reflect.has(o1, "p1")).toBeTruthy();
        expect(Object.keys(o1)).toEqual(["p1"]);
        expect(o1.p1).toBe("I am property one.");
        o1.p1 = 12;
        expect(o1.p1).toBe(12);

        Reflect.defineProperty(o1, "p2", {
            enumerable: false,
            value: "I am property two.",
            writable: false
        });
        expect(Reflect.has(o1, "p2")).toBeTruthy();
        expect(Object.keys(o1)).toEqual(["p1"]);        // NOTE: No p2!
        expect(o1.p2).toBe("I am property two.");
        expect(λ => o1.p2 = 34).toThrow();
    });

    it("reflect-defineProperty-accessor-properties",() => {
        let o2 = { firstName: "Moe", lastName: "Howard" };
        Reflect.defineProperty(o2, "fullName", {
            enumerable: true,
            get: function() { return `${this.firstName} ${this.lastName}`; },
            set: function(value) { [this.firstName, this.lastName] = value.split(' '); }
        });
        expect(o2.fullName).toBe("Moe Howard");
        o2.fullName = "Larry Fine";
        expect(o2.firstName).toBe("Larry");
        expect(o2.lastName).toBe("Fine");
    });

    // Reflect.enumerate(object) (equivalent of for...in loop over the properties of an object.)
    it("reflect-enumerate", () => {
        let stooge = {
            firstName: "Moe",
            lastName: "Howard",
            born: 1897,
            died: 1975
        };

        let iterator = Reflect.enumerate(stooge);
        expect(iterator.next().value).toEqual("firstName");
        expect(iterator.next().value).toEqual("lastName");
        expect(iterator.next().value).toEqual("born");
        expect(iterator.next().value).toEqual("died");
        expect(iterator.next().done).toBeTruthy();
    });

    // Reflect.get(object, property, this)
    // Reflect.set(object, property, value, this)
    it("reflect-get-and-set", () => {

        let stooge = {
            firstName: null,
            lastName: null,

            get fullName() { return `${this.firstName} ${this.lastName}`; },
            set fullName(value) { [this.firstName, this.lastName] = value.split(' '); }
        };

        stooge.firstName = "Moe";
        stooge.lastName = "Howard";
        expect(Reflect.get(stooge, "firstName")).toBe("Moe");
        expect(Reflect.get(stooge, "fullName", stooge)).toBe("Moe Howard");

        Reflect.set(stooge, "firstName", "Larry");
        Reflect.set(stooge, "lastName", "Fine");
        expect(stooge.fullName).toBe("Larry Fine");

        Reflect.set(stooge, "fullName", "Joe DeRita", stooge);
        expect(stooge.firstName).toBe("Joe");
        expect(stooge.lastName).toBe("DeRita");
    });

    // Reflect.getOwnPropertyDescriptor(object, property
    it("reflect-getOwnPropertyDescriptor", () => {
        let stooge = {
            firstName: null,
            lastName: null,

            get fullName() { return `${this.firstName} ${this.lastName}`; },
            set fullName(value) { [this.firstName, this.lastName] = value.split(' '); }
        };

        let pd1 = Reflect.getOwnPropertyDescriptor(stooge, "firstName");
        expect(pd1).toEqual({"value": null, "writable": true, "enumerable": true, "configurable": true});

        let pd2 = Reflect.getOwnPropertyDescriptor(stooge, "fullName");
        expect(pd2.configurable).toBeTruthy();
        expect(pd2.enumerable).toBeTruthy();
        expect(typeof(pd2.get) === "function").toBeTruthy();
    });

    // Reflect.getPrototypeOf(object)
    // Reflect.setPrototypeOf(object, prototype)
    it("reflect-get-and-set-prototypeOf", () => {
        let o1 = {};    // No prototype, so prototype is Object.prototype (null), the end of the chain.

        let proto2 = {p1: 12};
        let o2 = Object.create(proto2);

        expect(Reflect.getPrototypeOf(o1) === Object.prototype).toBeTruthy();
        expect(Reflect.getPrototypeOf(o1) === proto2).toBeFalsy();

        Reflect.setPrototypeOf(o1, proto2);
        expect(Reflect.getPrototypeOf(o1) === Object.prototype).toBeFalsy();
        expect(Reflect.getPrototypeOf(o1) === proto2).toBeTruthy();
    });

    // Reflect.has(object, property)    Searches the prototype chain
    it("reflect-has", () => {
        let stooge = {
            firstName: "Moe",
            lastName: "Howard",
            born: 1897,
            died: 1975
        };

        expect(Reflect.has(stooge, "firstName")).toBeTruthy();
        expect(Reflect.has(stooge, "fullName")).toBeFalsy();

        let proto = { fullName: function() { return `${this.firstName} ${this.lastName}`; }};
        Reflect.setPrototypeOf(stooge, proto);
        expect(Reflect.has(stooge, "fullName")).toBeTruthy();
    });

    // Reflect.isExtensible(object)
    it("reflect-isExtensible", () => {
        let o1 = {};
        expect(Reflect.isExtensible(o1)).toBeTruthy();

        // Any of the following, converts the object to non-extensible:
        Object.freeze(o1);
        Object.preventExtensions(o1);
        Object.seal(o1);
        Reflect.preventExtensions(o1);

        expect(Reflect.isExtensible(o1)).toBeFalsy();
    });

    // Reflect.ownKeys(object)  Returns the array of keys for the specified object.  It does NOT search the prototype chain.
    it("reflect-ownKeys", () => {
        let o1 = {a: 1, b: 2 };
        let proto = { c: 3 };
        Reflect.setPrototypeOf(o1, proto);

        expect(Reflect.has(o1, "a")).toBeTruthy();
        expect(Reflect.has(o1, "b")).toBeTruthy();
        expect(Reflect.has(o1, "c")).toBeTruthy();          // has() searches up the prototype chain.

        expect(Reflect.ownKeys(o1)).toEqual(["a", "b"]);    // NOTE: No 'c'; ownKeys() does not search up the prototype chain.
    });
});