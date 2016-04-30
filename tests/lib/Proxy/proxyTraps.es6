// Copyright (c) 2016 Alvin I Pivowar

describe("proxy-traps", () => {

    it("proxy-apply-trap", () => {
        const divide = (a, b) => b / a;     // Whoops!

        const reverse = {
            apply: function(target, thisArgument, args) {
                return Reflect.apply(target, thisArgument, [args[1], args[0]]);
            }
        };

        let proxy = new Proxy(divide, reverse);
        expect(proxy(6, 3)).toBe(2);
    });

    it("proxy-construct-trap", () => {
        class Person {
            constructor(firstName, middleName, lastName) {
                this.firstName = firstName;
                this.middleName = middleName;
                this.lastName = lastName;
            }
        }

        const personValidator = {
            construct: function(target, args, newTarget) {
                if (args.length < 2 || args.length > 3)
                    return { error: "Invalid number of parameters."};
                if (args.length === 2)
                    args = [args[0], "", args[1]];
                if (!args[0])
                    return { error: "firstName is required." };
                if (!args[2])
                    return { error: "lastName is required." };

                return Reflect.construct(target, args);
            }
        };

        let proxy = new Proxy(Person, personValidator);
        let person = new proxy("Moe", "Howard");
        expect(person.firstName).toBe("Moe");
        expect(person.lastName).toBe("Howard");

        person = new proxy("Larry Fine");
        expect(person.error).toBe("Invalid number of parameters.");

        person = new proxy("Curly", "", "");
        expect(person.error).toBe("lastName is required.");
    });

    it("proxy-defineProperty-trap", () => {
        let target = {};

        const handler = {
            defineProperty: function(target, property, descriptor) {
                return Reflect.defineProperty(target, (property === "beta") ? "gamma" : property, descriptor);
            }
        };

        let proxy = new Proxy(target, handler);

        Object.defineProperty(proxy, "alpha", { configurable: true, enumerable: true, value: "I am alpha", writable: true });
        expect("alpha" in proxy).toBeTruthy();

        Object.defineProperty(proxy, "beta", { configurable: true, enumerable: true, value: "I am beta", writable: true });
        expect("beta" in proxy).toBeFalsy();
        expect("gamma" in proxy).toBeTruthy();
    });

    it("proxy-deleteProperty-trap", () => {
        let person = {
            $id: 1,
            firstName: "Moe",
            lastName: "Howard"
        };

        const handler = {
            deleteProperty: function(target, property) {
                return Reflect.deleteProperty(target, (property[0] === '$') ? Symbol() : property);
            }
        };

        let proxy = new Proxy(person, handler);

        delete proxy.lastName;
        expect("lastName" in proxy).toBeFalsy();

        delete proxy.$id;
        expect(proxy.$id).toBe(1);
    });


    // To "B" or not to "B".
    it("proxy-get-trap", () => {
        const target = {
            black: 0x000000,
            blue: 0x0000FF,
            brown: 0xA52A2A,
            gold: 0xFFD700,
            green: 0x00FF00,
            grey: 0x808080,
            orange: 0xFFA500,
            red: 0xFF0000,
            silver: 0xC0C0C0,
            violet: 0xEE82EE,
            white: 0xFFFFFF,
            yellow: 0xFFFF00
        };

        const handler = {
            get: function(target, property, receiver) {
                return (property.toLowerCase().startsWith("b")) ? undefined : Reflect.get(target, property, receiver);
            }
        };

        let proxy = new Proxy(target, handler);
        expect(proxy.gold).toBe(0xFFD700);
        expect(proxy.blue).toBeUndefined();
    });

    it("proxy-getOwnPropertyDescriptor-trap", () => {
        const target = {
            black: 0x000000,
            blue: 0x0000FF,
            brown: 0xA52A2A,
            gold: 0xFFD700,
            green: 0x00FF00,
            grey: 0x808080,
            orange: 0xFFA500,
            red: 0xFF0000,
            silver: 0xC0C0C0,
            violet: 0xEE82EE,
            white: 0xFFFFFF,
            yellow: 0xFFFF00
        };

        const handler = {
            getOwnPropertyDescriptor: function(target, property) {
                return (property.toLowerCase().startsWith("b")) ? undefined : Reflect.getOwnPropertyDescriptor(target, property);
            }
        };

        let proxy = new Proxy(target, handler);
        expect(Object.getOwnPropertyDescriptor(proxy, "blue")).toBeUndefined();
        expect(Object.getOwnPropertyDescriptor(proxy, "red")).toBeDefined();
    });

    it("proxy-has-trap", () => {
        const target = {
            black: 0x000000,
            blue: 0x0000FF,
            brown: 0xA52A2A,
            gold: 0xFFD700,
            green: 0x00FF00,
            grey: 0x808080,
            orange: 0xFFA500,
            red: 0xFF0000,
            silver: 0xC0C0C0,
            violet: 0xEE82EE,
            white: 0xFFFFFF,
            yellow: 0xFFFF00
        };

        const handler = {
            has: function(target, property) {
                return (property.toLowerCase().startsWith("b")) ? false : Reflect.has(target, property);
            }
        };

        let proxy = new Proxy(target, handler);
        expect("green" in proxy).toBeTruthy();
        expect("brown" in proxy).toBeFalsy();
    });

    it("proxy-extensible-traps", () => {
        let isExtensibleCounter = 0;
        let preventExtensionCounter = 0;

        const target = {};

        const handler = {
            isExtensible: function(target) {
                ++isExtensibleCounter;
                return Reflect.isExtensible(target);
            },
            preventExtensions: function(target) {
                ++preventExtensionCounter;
                return Reflect.preventExtensions(target);
            }
        };

        let proxy = new Proxy(target, handler);
        expect(Object.isExtensible(proxy)).toBeTruthy();

        expect(Object.preventExtensions(proxy)).toBeTruthy();
        expect(Object.isExtensible(proxy)).toBeFalsy();

        expect(isExtensibleCounter).toBe(2);
        expect(preventExtensionCounter).toBe(1);
    });

    it("proxy-ownKeys-trap", () => {
        let person = {
            $id: 1,
            firstName: "Moe",
            lastName: "Howard"
        };

        expect(Object.getOwnPropertyNames(person).length).toBe(3);

        const secret = {
            ownKeys: function(target) {
                return Reflect.ownKeys({});
            }
        };

        let proxy = new Proxy(person, secret);
        expect(Object.getOwnPropertyNames(proxy).length).toBe(0);
    });

    it("proxy-set-trap", () => {
        class Person {
            constructor(fullName) {
                [this.firstName, this.lastName] = fullName.split(' ');
            }
        }

        const setRecorder = {
            set: function(target, property, value, receiver) {
                let recorder = Reflect.get(target, Symbol.for("recorder"), receiver);
                if (!recorder) {
                    recorder = new WeakMap();
                    Reflect.set(target, Symbol.for("recorder"), recorder, receiver);
                }

                if (!recorder.has(target))
                    recorder.set(target, new Map());

                let map = recorder.get(target);
                map.set(property, new Date());

                return Reflect.set(target, property, value, receiver);
            }
        };

        let person = new Person("Moe Howard");
        let proxy = new Proxy(person, setRecorder);
        proxy.firstName = "Shemp";

        let recorder = person[Symbol.for("recorder")];
        let map = recorder.get(person);
        expect(map.has("firstName")).toBeTruthy();
        let dateTime = map.get("firstName");

        let today = new Date();
        expect(dateTime.getFullYear()).toBe(today.getFullYear());
        expect(dateTime.getMonth()).toBe(today.getMonth());
        expect(dateTime.getDate()).toBe(today.getDate());
    });

    it("revocable-proxy", () => {
        const target = {
            black: 0x000000,
            blue: 0x0000FF,
            brown: 0xA52A2A,
            gold: 0xFFD700,
            green: 0x00FF00,
            grey: 0x808080,
            orange: 0xFFA500,
            red: 0xFF0000,
            silver: 0xC0C0C0,
            violet: 0xEE82EE,
            white: 0xFFFFFF,
            yellow: 0xFFFF00
        };

        const handler = {
            get: function(target, property, receiver) {
                return (property.toLowerCase().startsWith("b")) ? undefined : Reflect.get(target, property, receiver);
            }
        };

        let { proxy, revoke } = Proxy.revocable(target, handler);
        expect(proxy.gold).toBe(0xFFD700);
        expect(proxy.blue).toBeUndefined();

        revoke();
        expect(λ => proxy.blue).toThrow();
    });
});