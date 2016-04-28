// Copyright (c) Alvin Pivowar 2016// Copyright (c) Alvin Pivowar 2016

describe("es6-typed-array", () => {

    //  EX: LB6-TYPED_ARRAY

    it("32-bit-array", () => {
        let buffer = new ArrayBuffer(20);   // 20 bytes (5 32-bit numbers)
        let typedArray = new Int32Array(buffer);

        typedArray[0] = 93649055;
        typedArray[1] = 129688270;
        typedArray[2] = 78980617;
        typedArray[3] = 167698121;
        typedArray[4] = 2028403;

        // Get the third int:
        let integer = typedArray[2];
        expect(integer).toBe(78980617);
    });
});