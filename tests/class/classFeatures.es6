// Copyright (c) Alvin Pivowar 2016

describe("es6-class-features", () => {

    //  EX: CF6-DECLARATION

    it("class-declaration", () => {
        class class1 {
            constructor() {}
        }

        let class2 = class {
            _name = "class2"

            constructor(name) {
                this._name = name;
            }

            get name() { return _name;}
        };

        let c = new class1();
        c = new class2();
        expect(λ => new class4()).toThrow();      // class definitions are NOT hoisted.

        class class3 {
            constructor(name) {
                if (name == "Moe")
                    return { error: "Moe is not allowed!" }
                this.name = name;
            }
        }

        expect(new class3("Larry").name).toBe("Larry");
        expect(new class3("Moe").error).toBe("Moe is not allowed!")

        class class4 {}
    });

    //  EX: CF6-METHODS

    it("class-prototype-methods", () => {
        class class1 {
            firstName = null;
            lastName = null;

            constructor(firstName, lastName) {
                this.firstName = firstName;
                this.lastName = lastName;
            }

            fullName() { return `${this.firstName} ${this.lastName}`; }
        }

        // fullName() is in the prototype, not on the class.
        let c = new class1();
        expect(c.fullName).toBeDefined();
        expect(class1.fullName).toBeUndefined();
        expect(class1.prototype.fullName).toBeDefined();
    });

    it("class-static-methods", () => {
        class class1 {
            firstName = null;
            lastName = null;

            constructor(firstName, lastName) {
                this.firstName = firstName;
                this.lastName = lastName;
            }

            static fullName() { return `${this.firstName} ${this.lastName}`; }
        }


        // fullName() is on the class, not in the prototype.
        let c = new class1();
        expect(c.fullName).toBeUndefined();
        expect(class1.fullName).toBeDefined();
        expect(class1.prototype.fullName).toBeUndefined();
    });

    it("class-get-and-set-methods", () => {
        class class1 {
            firstName = null;
            lastName = null;

            constructor(firstName, lastName) {
                this.firstName = firstName;
                this.lastName = lastName;
            }

            get fullName() { return `${this.firstName} ${this.lastName}`; }
            set fullName(value) { [this.firstName, this.lastName] = value.split(' '); }
        }

        let c = new class1("Moe", "Howard");
        expect(c.fullName).toBe("Moe Howard");

        c.fullName = "Larry Fine";
        expect(c.firstName).toBe("Larry");
        expect(c.lastName).toBe("Fine");
    });

    //  EX: CF6-INHERITANCE

    it("class-inheritance", () => {
        class Rectangle {
            constructor(length, width) {
                this.name = "rectangle";
                this.length = length;
                this.width = width;
            }

            get area() {
                return this.length * this.width;
            }

            get perimiter() {
                return 2 * this.length + 2 * this.width;
            }

            resize(Δlength, Δwidth) {
                this.length += Δlength;
                this.width += Δwidth;
            }
        }

        // By putting the subclass definition in a closure,
        // when the Square is defined, the isSquare getter is added to the
        // prototype of Rectangle.
        const Square = (λ => {
            Reflect.defineProperty(Rectangle.prototype, "isSquare", {
                configurable: false,
                enumerable: true,
                get: function() { return this.length === this.width },
                set: undefined
            });

            return class extends Rectangle {
                constructor(length) {
                    super(length, length);
                    this.name = "square";
                }

                resize(Δlength) {
                    super.resize(Δlength, Δlength);
                }
            }
        })();

        let r1 = new Rectangle(3, 4);
        expect(r1.name).toBe("rectangle");
        expect(r1.isSquare).toBeFalsy();
        expect(r1.area).toBe(12);
        expect(r1.perimiter).toBe(14);

        let s1 = new Square(5);
        expect(s1.name).toBe("square");
        expect(s1.isSquare).toBeTruthy();   // Note that the getter is found on the prototype chain.
        expect(s1.area).toBe(25);
        expect(s1.perimiter).toBe(20);
    });

    it("class-generators", () => {
        class IntRandomizer {
            constructor(min, max) {
                this.min = min;
                this.max = max;
            }

            * values() {
                while(true)
                    yield IntRandomizer.getRandomInt(this.min, this.max);
            }

            static getRandomInt = (min, max) => Math.trunc(Math.random() * (max - min)) + min;
        }

        let randomizer = new IntRandomizer(0, 9);
        let generator = randomizer.values();

        expect(typeof(generator.next().value) === "number").toBeTruthy();
        expect(typeof(generator.next().value) === "number").toBeTruthy();
        expect(typeof(generator.next().value) === "number").toBeTruthy();
        expect(typeof(generator.next().value) === "number").toBeTruthy();
    });
});