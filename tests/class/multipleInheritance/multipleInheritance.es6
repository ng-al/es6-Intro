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

    // The MultipleInheritance class is defined in samples/MultipleInheritance.es6

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