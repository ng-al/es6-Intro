// Copyright (c) Alvin Pivowar 2016

describe("es6-string-features", () => {

        // EX: LS6-UNICODE

    it("string-unicode", () => {
        const es5RocketChar = "\uD83D\uDE80";
        const es6RocketChar = "\u{1F680}";

        expect(es5RocketChar === es6RocketChar).toBeTruthy();

        let cp1 = es6RocketChar.codePointAt(0);
        let cp2 = es6RocketChar.codePointAt(1);
        expect(cp1).toBe(0x1F680);
        expect(cp2).toBe(0xDE80);

        let rocket = String.fromCodePoint(0x1F680);
        expect(rocket === es5RocketChar).toBeTruthy();
        expect(rocket === es6RocketChar).toBeTruthy();

        rocket = String.fromCodePoint(0xD83D, 0xDE80);
        expect(rocket === es5RocketChar).toBeTruthy();
        expect(rocket === es6RocketChar).toBeTruthy();

        const e1 = '\u00E9';
        const e2 = 'e\u0301';
        const e3 = 'é';

        expect(e1 == e2).toBeFalsy();
        expect(e1 == e3).toBeTruthy();
        expect(e2 == e3).toBeFalsy();

        expect(e1.normalize() == e2.normalize()).toBeTruthy();
        expect(e1.normalize() == e3.normalize()).toBeTruthy();
        expect(e2.normalize() == e2.normalize()).toBeTruthy();
    });

    //  EX: LS6-METHODS

    it("string-methods", () => {
        const sentence = "The quick brown fox jumps over the lazy dog";

        expect(sentence.endsWith("lazy", 39)).toBeTruthy();
        expect(sentence.includes("jump")).toBeTruthy();
        expect(sentence.startsWith("quick", 4)).toBeTruthy();

        const banana = ('b' + "an".repeat(3)).slice(0, -1);
        expect(banana).toBe("banana");
    });

    //  EX: LS6-TEMPLATES

    it("templates", () => {
        const stooge = {
            firstName: "Moe",
            lastName: "Howard",
            born: 1897,
            died: 1975
        };

        // Template Expressions
        let message = `When ${stooge.firstName} ${stooge.lastName} died, he was ${stooge.died - stooge.born} years old.`;
        expect(message).toBe("When Moe Howard died, he was 78 years old.");

        // Multi-Line Templates
        const singleLine = "line one,line two,line three";
        let index = singleLine.indexOf("one,");
        let singleLineNextChar = singleLine[index + "one,".length];
        expect(singleLineNextChar).toBe('l');

        const multiLine = `
            line one,
            line two,
            line three`;
        index = multiLine.indexOf("one,");
        let multiLineNextChar = multiLine[index + "one,".length];
        expect(multiLineNextChar).toBe('\n');

        // Raw Strings
        const plain = "I am\ndivided";                  // Contains a newline.
        const raw = String.raw `I am\ndivided`;         // Contains the \ and n
        expect(raw.length - plain.length).toBe(1);
    });

    //  EX: LS6-TAGFN

    it("template-tag-functions", () => {
        const stooge = {
            firstName: "Moe",
            lastName: "Howard",
            born: 1897,
            died: 1975
        };

        const tagFn = (strings, ...values) => {
            let result = "";
            let stoogeName = "";
            for (let i = 0; i < strings.length; ++i) {
                switch(i) {
                    case 0:
                        result += strings[i];
                        stoogeName = values[i];
                        break;

                    case 1:
                        stoogeName += (' ' + values[i]);
                        if (stoogeName == "Moe Howard") result += "the mean stooge";
                        if (stoogeName == "Curly Howard") result += "my favorite stooge";
                        break;

                    case 2:
                        result += strings[i];
                        result += (values[i] < 50 ? values[i] : "many");
                        break;

                    default:
                        result += strings[i];
                        if (i < values.length) result += values[i];
                }
            }
            return result;
        };

        let message = tagFn `When ${stooge.firstName} ${stooge.lastName} died, he was ${stooge.died - stooge.born} years old.`;
        expect(message).toBe("When the mean stooge died, he was many years old.");
    });
});