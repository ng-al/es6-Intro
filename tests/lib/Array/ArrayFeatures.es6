// Copyright (c) Alvin Pivowar 2016

describe("es6-array-features", () => {

    //  EX: LA6-SPREAD
    //  EX: LA6-BUILDING

    it("array-spread-operator", () => {
        let one = [1, 2, 3];
        let two = [4, ...one, 5, 6];
        expect(two).toEqual([4, 1, 2, 3, 5, 6]);

        one = [1, 2, 3];
        two = [4];
        // es5: Array.prototype.push.apply(two, one);
        two.push(...one);
        expect(two).toEqual([4, 1, 2, 3]);

        one = [1, 2];
        two = [3, 4, 5];
        let three = [...one, ...two, ...[6, 7]];
        expect(three).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it("array-construction-methods", () => {
        // Array.from iterables

        const message = "Psst! This is a secret.";

        let plainTextArray = Array.from(message);
        expect(plainTextArray.length === message.length).toBeTruthy();
        expect(plainTextArray[4]).toBe('!');

        let cipherArray = Array.from(message, function(v) {
                return String.fromCharCode((this.action === "encrypt")
                    ? v.charCodeAt(0) + this.key
                    : v.charCodeAt(0) - this.key)
            },
            { action: "encrypt", key: 5 });

        expect(cipherArray[0]).toBe('U');
        let cipherText = cipherArray.join('');
        expect(cipherText).toBe("Uxxy&%Ymnx%nx%f%xjhwjy3");

        plainTextArray = Array.from(cipherText, function(v) {
                return String.fromCharCode((this.action === "encrypt")
                    ? v.charCodeAt(0) + this.key
                    : v.charCodeAt(0) - this.key)
            },
            { action: "decrypt", key: 5 });
        let plainText = plainTextArray.join('');
        expect(plainText).toBe(message);

        // Array.from "array like"
        const alphabet = Array.from({ length: 26}, (v, i) => String.fromCharCode('A'.charCodeAt(0) + i)).join('');
        expect(alphabet).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

        // Array.of
        let a1 = Array.of([], true, 12, {}, "hello");
        expect(a1.length).toBe(5);
        expect(a1[2]).toBe(12);
    });

    const isPrime = n => {
        if (isNaN(n) || ! isFinite(n) || n % 1 || n < 2) return false;
        var m = Math.sqrt(n);
        for (var i = 2; i <= m; i++) if (n % i==0) return false;
        return true;
    };

    //  EX: LA6-DATA_METHODS

    it("array-data-methods", () => {
        const array = Array.from("0123456789");
        expect(array.join('')).toBe("0123456789");

        // Array.copyWithin
        let a = Array.from(array);
        a.copyWithin(6, 1, 4);
        expect(a.join('')).toBe("0123451239");
        a = Array.from(array);
        a.copyWithin(1, -3);
        expect(a.join('')).toBe("0789456789");

        // Array.fill

        a = Array.from(array);
        a.fill(3, 3, 7);
        expect(a.join('')).toBe("0123333789");

        a = Array.from(array);
        a.fill(7, -5, -2);
        expect(a.join('')).toBe("0123477789");

        // Array.find
        let reverse = array.reverse();
        expect(reverse.join('')).toBe("9876543210");
        let firstPrime = reverse.find(isPrime);         // Array.find(fn, index, thisObj);
        expect(firstPrime).toBe('7');

        // Array.findIndex
        let firstPrimeIndex = reverse.findIndex(isPrime);
        expect(firstPrimeIndex).toBe(2);
    });

    // EX: LA6-DESTRUCTURING

    it("array-destructuring", () => {
        const one = [1, 2, 3, 4, 5, 6, 7, 8];

        let [a1, b1] = one;
        expect(a1).toBe(1);
        expect(b1).toBe(2);

        let [a2,, b2,,, c2] = one;
        expect(a2).toBe(1);
        expect(b2).toBe(3);
        expect(c2).toBe(6);

        let [,, a3, ...b3] = one;
        expect(a3).toBe(3);
        expect(b3).toEqual([4, 5, 6, 7, 8]);

        const two = [32, undefined, undefined, 96, undefined, 64, 46, 92, undefined, 4];
        let [d1 = 1, d2 = 2, d3 = 3, d4 = 4, d5 = 5, d6 = 6, d7 = 7, d8 = 8, d9 = 9, d10 = 10] = two;
        expect(d1).toBe(32);
        expect(d2).toBe(2);
        expect(d3).toBe(3);
        expect(d4).toBe(96);
        expect(d5).toBe(5);
        expect(d6).toBe(64);
        expect(d7).toBe(46);
        expect(d8).toBe(92);
        expect(d9).toBe(9);
        expect(d10).toBe(4);

        const three = [1, 2, [3, 4]];
        let [w, x, [y, z]] = three;
        expect(w).toBe(1);
        expect(x).toBe(2);
        expect(y).toBe(3);
        expect(z).toBe(4);
    });

    //  EX: LA6-REFLECTION

    it("array-reflection-methods", () => {
        let a = [];
        a[3] = 'A';
        a[1] = 'B';
        a[4] = 'C';
        a[5] = 'D';

        let entries = [ ...a.entries() ];
        expect(entries.length).toBe(6);
        expect(entries[1].length).toBe(2);
        expect(entries[1][0]).toBe(1);
        expect(entries[1][1]).toBe('B');

        let keys = [ ...a.keys() ];
        expect(keys.length).toBe(6);
        expect(keys[2]).toBe(2);

        let values = [ ...a.values() ];
        expect(values.length).toBe(6);
        expect(values[3]).toBe('A');
    });
});