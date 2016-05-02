// Copyright (c) Alvin Pivowar 2016

describe("multiple-inheritance-with-proxies", () => {

    /*
    **  Simple multiple inheritance example showing property and method access.
    */

    class Animal {
        constructor() {
            this.isAnimal = true;
            this.eatCount = 0;
        }

        eat() { ++this.eatCount; }
    }

    class Mammal extends Animal {
        constructor() {
            super();
            this.isMammal = true;
            this.breatheCount = 0;
        }

        breathe() { ++ this.breatheCount; }
    }

    class WingedAnimal extends Animal {
        constructor() {
            super();
            this.isWingedAnimal = true;
            this.flapCount = 0;
        }

        flap(beats = 1) { this.flapCount += beats; }
    }

    // This is the multiple inheritance proxy handler.
    // The "Bat" example uses findByName().
    //
    // The example at the bottom of the page uses membership ϵ
    // to discriminate between two getter methods in the prototype chain having the same name.
    // This uses findBySymbol().

    /*  class is defined in samples
        class MultipleInheritance {
            constructor() {
                this.isInitalized = false;
                this.prototypes = [];
            }

            executeGet(prototype, property, receiver) {
                return (typeof(prototype[property]) === "function")
                    ? (...args) => Reflect.apply(prototype[property], prototype, args)
                    : Reflect.get(prototype, property, receiver);
            }

            findByName(property, receiver) {
                for (let prototype of this.prototypes) {
                    if (Reflect.has(prototype, property))
                        return this.executeGet(prototype, property, receiver);
                }

                // This will throw a not-found error.
                return Reflect.get({}, property, receiver);
            }

            findBySymbol(discriminatedProperty, receiver) {
                const $$className = Symbol.for("className");
                let [property, discriminator] = discriminatedProperty.split("ϵ");

                for (let prototype of this.prototypes) {
                    if (Reflect.has(prototype, $$className) &&
                        prototype[$$className].toLowerCase() === discriminator.toLowerCase()) {

                        return this.executeGet(prototype, property, receiver);
                    }
                }

                return Reflect.get({}, property, receiver);
            }


            get(target, property, receiver) {
                this.initialize(target);

                return (property.includes("ϵ"))
                    ? this.findBySymbol(property, receiver)
                    : this.findByName(property, receiver);
            }

            initialize(target) {
                if (!this.isInitalized) {
                    if (target && typeof(target[Symbol.iterator]) == "function")
                        this.prototypes.push(...target);
                    this.isInitalized = true;
                }
            }
        }
    */

    it("a-bat-is-a-winged-mammal", () => {
        class Bat /* extends WingedAnimal, Mammal */ {
            constructor() {
                this.isBat = true;
                this.echoCount = 0;
                return new Proxy([this, new WingedAnimal(), new  Mammal()], new MultipleInheritance());
            }

            echo() { ++this.echoCount; }
        }

        let bat = new Bat();

        expect(bat.isAnimal).toBeTruthy();
        expect(bat.isBat).toBeTruthy();
        expect(bat.isMammal).toBeTruthy();
        expect(bat.isWingedAnimal).toBeTruthy();

        bat.breathe(); bat.breathe(); bat.breathe();
        bat.eat();
        bat.echo(); bat.echo();
        bat.flap(4);

        expect(bat.breatheCount).toBe(3);
        expect(bat.eatCount).toBe(1);

        expect(bat.echoCount).toBe(2);
        expect(bat.flapCount).toBe(4);
    });

    /*
    **  Multiple inheritance with duplicate keys discriminated via symbols.
    */

    const $$className = Symbol.for("className");

    class Base1 {
        constructor() {
            this[$$className] = "one";
        }

        get getter() { return "I am Base1"; }
    }

    class Base2 {
        constructor() {
            this[$$className] = "two";
        }

        get getter() { return "I am Base2"; }
    }

    class Derived /* extends Base1, Base2 */ {
        constructor() {
            return new Proxy([this, new Base1(), new Base2()], new MultipleInheritance());
        }
    }

    it("multiple-inheritance-discrimination-with-symbols", () => {
        let derived = new Derived();

        // Since the Base1 prototype comes first, the MultipleInheritance handler uses that one.
        expect(derived.getter).toBe("I am Base1");

        // Use discriminators.
        expect(derived.getterϵOne).toBe("I am Base1");
        expect(derived.getterϵTwo).toBe("I am Base2");
    });
});