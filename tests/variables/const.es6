// Copyright (c) Alvin Pivowar 2016

describe("es6-constants", () => {
    // EX: VC6-CONST

    it("constants-are-immutable", () => {
        const C1 = 12;

        // Can't assert in test; this line throws exception during transpiling:
        // C1 = 13;

        // You can re-use a constant variable name in a loop:
        const NAMES = ["Alice", "Brenda", "Cathy"];
        for (let i = 0; i < NAMES.length; ++i) {
            const CURRENT_NAME = NAMES[i];
            expect(CURRENT_NAME).toBe(NAMES[i]);
        }

        // Although the constant property is immutable, if it references an object;
        // then that object is mutable:
        const PERSON = {firstName: "Moe", lastName: "Howard"};
        // Can't do this: PERSON = {firstName: "Larry", lastName: "Fine"};
        PERSON.firstName = "Larry";
        PERSON.lastName = "Fine";

        expect(`${PERSON.firstName} ${PERSON.lastName}`).toBe("Larry Fine");
    });
});