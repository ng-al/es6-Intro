// Copyright (c) Alvin Pivowar 2016

describe("es6-function-parameters", () => {

    // EX: FP6-DEFAULT

    it("default-function-parameter-values", () => {
        function addOrIncFn(x, y = 1) {
            return x + y;
        }

        const addOrInc = (x, y = 1) => x + y;

        expect(addOrIncFn(12, 34)).toBe(46);
        expect(addOrIncFn(13)).toBe(14);

        expect(addOrInc(56, 78)).toBe(134);
        expect(addOrInc(56)).toBe(57);
    });

    it("passing-spread", function() {
        function addOrIncFn(x, y = 1) {
            return x + y;
        }

        var data = [12, 34];
        var result = addOrIncFn(...data);
        expect(result).toBe(46);
    });

    // EX: FP6-REST

    it("passing-variable-number-of-parameters", () => {
        const formatter = (format, ...args) => {
            args.forEach((arg, i) => format = format.replace("{" + i + "}", args[i]));
            return format;
        };

        expect(formatter("Hello there, {0}!", "smedley")).toBe("Hello there, smedley!");
    });

    // EX: FP6-DESTRUCTURING

    /*
        Lisp-inspired example demonstrating array spreading and parameter deconstructuring.
     */

    const car = ([car,]) => car;
    const cdr = ([car, ...cdr]) => [...cdr];
    const cons = (atom, list = []) => [atom, ...list];


    it("array-deconstructuring-parameters", () => {
        let list = cons("apple", cons("banana", cons("cherry")));
        expect(list).toEqual(["apple", "banana", "cherry"]);

        let result = car(list);
        expect(result).toBe("apple");

        result = cdr(list);
        expect(result).toEqual(["banana", "cherry"]);
    });

    it("object-deconstructuring-parameters", () => {
        const fullName = ({ firstName, lastName }) => `${firstName} ${lastName}`;

        let larry = {firstName: "Larry", lastName: "Fine"};
        expect(fullName(larry)).toBe("Larry Fine");
    });
});