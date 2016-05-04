// Copyright (c) Alvin Pivowar 2016

const Enum = (λ => {
    const _parsedItems = new WeakMap();

    class _enum {
        constructor(isFlags) {
            if (isFlags)
                this[Enum.flags] = true;
            _parsedItems.set(this, new Map());
        }

        * [Symbol.iterator]() { yield* this.entries(); }

        * entries() {
            for (let property in this) {
                if (this.hasOwnProperty(property)) {
                    yield [this[property].key, this[property].value];
                }
            }
        }

        * keys() {
            for (let property in this) {
                if (this.hasOwnProperty(property))
                    yield this[property].key;
            }
        }

        * values() {
            for (let property in this) {
                if (this.hasOwnProperty(property))
                    yield this[property].value;
            }
        }

        forEach(fn) {
            let index = 0;
            for (let property in this) {
                if (this.hasOwnProperty(property))
                    fn([this[property].key, this[property].value], index++, this);
            }
        }
    }

    return class {
        static flags = Symbol();

        constructor(obj) {
            if (!obj) throw new Error("enum object is required.");

            let result = new _enum(Enum.isFlagEnum(obj));
            for (let property in obj) {
                if (obj.hasOwnProperty(property)) {
                    result[property] = {
                        id: Symbol(),
                        key: property,
                        value: obj[property],

                        toString: λ => property
                    };
                }
            }

            return result;
        }

        static isFlagEnum(enumObj) {
            for (let symbol of Object.getOwnPropertySymbols(enumObj)) {
                if (symbol === Enum.flags)
                    return true;
            }

            return false;
        }

        static parse(enumObj, text) {
            let [success, item] = Enum.tryParse(enumObj, text);
            if (!success) {
                let msg = (typeof(item) === "string") ? item : `'${text}' is not a valid key for the specified enum.`;
                throw new Error(msg);
            }

            return item;
        }

        static toString(enumObj, value) {
            if (!enumObj) return [false, "enumObj is required."];
            if (enumObj.constructor.name != "_enum") return [false, "enumObj must be an enum."];
            if (!value) return [false, "value is required."];

            for (let property in enumObj) {
                if (enumObj.hasOwnProperty(property) && enumObj[property].value === value)
                    return enumObj[property].key;
            }

            if (Enum.isFlagEnum(enumObj)) {
                const isPowerOfTwo = n => (n !== 0) && ((n & (n - 1)) === 0);

                let result = "";
                for (let property in enumObj) {
                    if (enumObj.hasOwnProperty(property) &&
                        isPowerOfTwo(enumObj[property].value) &&
                        (enumObj[property].value & value) !== 0) {

                        if (result.length > 0) result += ',';
                        result += enumObj[property].key;
                    }
                }

                if (result)
                    return result;
            }

            return undefined;
        }

        static tryParse(enumObj, text) {
            if (!enumObj) return [false, "enumObj is required."];
            if (enumObj.constructor.name != "_enum") return [false, "enumObj must be an enum."];
            if (!text) return [false, "text is required."];

            for (let property in enumObj) {
                if (enumObj.hasOwnProperty(property) && enumObj[property].key === text)
                    return [true, enumObj[property]];
            }

            if (Enum.isFlagEnum(enumObj)) {
                let result = 0;
                for (let key of text.split(',')) {
                    for (let property in enumObj) {
                        if (enumObj.hasOwnProperty(property) && enumObj[property].key === key)
                            result |= enumObj[property].value;
                    }
                }

                if (result) {
                    let key = Enum.toString(enumObj, result);

                    if (!_parsedItems.get(enumObj).has(result)) {
                        _parsedItems.get(enumObj).set(result, {
                            id: Symbol(),
                            key: key,
                            value: result,

                            toString: λ => key
                        });
                    }

                    return [true, _parsedItems.get(enumObj).get(result)];
                }
            }

            return [false, undefined];
        }
    }
})();

describe("enum-tests", () => {
    const Color = new Enum({
        Red: 1,
        Green: 2,
        Blue: 3
    });

    it("enum-color-test", () => {
        expect(Color.Red.key).toBe("Red");
        expect(Color.Red.value).toBe(1);
        expect(Color.Red === Color.Red).toBeTruthy();
        expect(Color.Red === Color.Green).toBeFalsy();
        expect(Color.Blue.toString()).toBe("Blue");

        let keys = [];
        let values = [];
        for (let entry of Color) {
            keys.push(entry[0]);
            values.push(entry[1]);
        }
        expect(keys).toEqual(["Red", "Green", "Blue"]);
        expect(values).toEqual([1, 2, 3]);

        keys = [];
        values = [];
        Color.forEach(([key, value]) => {
            keys.push(key);
            values.push(value);
        });
        expect(keys).toEqual(["Red", "Green", "Blue"]);
        expect(values).toEqual([1, 2, 3]);

        let iterator = Color.entries();
        expect(iterator.next().value).toEqual(["Red", 1]);
        expect(iterator.next().value).toEqual(["Green", 2]);
        expect(iterator.next().value).toEqual(["Blue", 3]);

        iterator = Color.keys();
        expect(iterator.next().value).toBe("Red");
        expect(iterator.next().value).toBe("Green");
        expect(iterator.next().value).toBe("Blue");

        iterator = Color.values();
        expect(iterator.next().value).toBe(1);
        expect(iterator.next().value).toBe(2);
        expect(iterator.next().value).toBe(3);
    });

    it("enum-color-parse-test", () => {
        let [success, item] = Enum.tryParse(Color, "Blue");
        expect(success).toBeTruthy();
        expect(item === Color.Blue).toBeTruthy();

        expect(Enum.parse(Color, "Green").value).toBe(2);

        [success, item] = Enum.tryParse(Color, "Bogus");
        expect(success).toBeFalsy();
        expect(item).toBeUndefined();

        expect(λ => Enum.parse(Color, "Bogus")).toThrow();
    });

    const ColorFlags = new Enum({
        [Enum.flags]: true,
        Primary: 0x01,
        Red: 0x02 | 0x01,
        Green: 0x04 | 0x01,
        Blue: 0x08 | 0x01,
        Magenta: 0x10,
        Yellow: 0x20,
        Cyan: 0x40
    });

    it ("enum-flags-test", () => {
        expect(ColorFlags.Red.key).toBe("Red");
        expect(ColorFlags.Red.value).toBe(3);
        expect(ColorFlags.Red.toString()).toBe("Red");

        expect(Enum.toString(ColorFlags, 9)).toBe("Blue");
        expect(Enum.toString(ColorFlags, 16)).toBe("Magenta");
        expect(Enum.toString(ColorFlags, 33)).toBe("Primary,Yellow");
    });

    it("enum-flags-parse-test", () => {
        let [success, item] = Enum.tryParse(ColorFlags, "Primary,Magenta");
        expect(success).toBeTruthy();
        expect(item.key).toBe("Primary,Magenta");
        expect(item.value).toBe(17);
        expect(item.toString()).toBe("Primary,Magenta");

        expect(Enum.parse(ColorFlags, "Primary,Blue") === Enum.parse(ColorFlags, "Blue,Primary")).toBeTruthy();
    });
});