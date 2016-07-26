// Copyright (c) Alvin Pivowar 2016

describe("this-examples", () => {
    class Blue {
        constructor() {
            this.color = "Blue";
        }

        whatColor() {
            return ["Blue", this.color];
        }
    }

    class Pink {
        constructor() {
            this.color = "Pink";
        }

        whatColor() {
            return ["Pink", this.color];
        }
    }


    // this is not what you think!
    it("what-is-this", () => {
        const blue = new Blue();
        expect(blue.color).toBe("Blue");

        const pink = new Pink();
        expect(pink.color).toBe("Pink");

        let [name, color] = blue.whatColor();
        expect(name).toBe("Blue");
        expect(color).toBe("Blue");

        [name, color] = pink.whatColor();
        expect(name).toBe("Pink");
        expect(color).toBe("Pink");

        // Note in this test, the method in the pink class is called,
        // but the color it returns is from the blue class!
        [name, color] = pink.whatColor.call(blue);
        expect(name).toBe("Pink");
        expect(color).toBe("Blue");
    });



    // Sometimes we need this.
    const fnCallback = function(currentValue, index, array) {
        expect(this.color).toBe("Blue");
    };

    const lambdaCallback = (currentValue, index, array) => {
        expect(this.color).toBe("Pink");
    };

    it("we-need-this", () => {
        const array = [1, 2, 3];

        array.forEach(fnCallback, new Blue());
        expect(() => {
            array.forEach(lambdaCallback, new Pink());
        }).toThrow();
    });


    // Sometimes, we don't want this
    class Chameleon {
        constructor(color1, color2) {
            this.color = color2;

            return new Proxy(this, {
                get: function(target, property, receiver) {
                    return (property === "color" ? color1 : Reflect.get(target, property, receiver));
                }
            });
        }

        funcColor = function() { return this.color; };
        fatArrowColor = λ => { return this.color; }
    }

    it("sometimes-this-is-that", () => {
        const colorChanger = new Chameleon("Green", "Red");

        expect(colorChanger.color).toBe("Green");
        expect(colorChanger.funcColor()).toBe("Green");
        expect(colorChanger.fatArrowColor()).toBe("Red");
    });
});



