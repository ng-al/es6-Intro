// Copyright (c) Alvin Pivowar 2016

describe("es6-array-buffers", () => {

    //  EX: LB6-ARRAY_BUFFER

    it("32-bit-buffer", () => {
        let buffer = new ArrayBuffer(20);   // 20 bytes (5 32-bit numbers)
        let view = new DataView(buffer);

        view.setInt32(0, 93649055);
        view.setInt32(4, 129688270);
        view.setInt32(8, 78980617);
        view.setInt32(12, 167698121);
        view.setInt32(16, 2028403);

        // Get the "third" int:
        let integer = view.getInt32((3 - 1) * 4);
        expect(integer).toBe(78980617);
    });
});