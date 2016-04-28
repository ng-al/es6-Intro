// Copyright (c) Alvin Pivowar 2015, 2016

describe("es6-scoping", () => {
    class ResultAggregator {
        constructor() {
            this._producers = [];
            this._results = [];
        }

        addResult(result) {
            this._results.push(result);
        }

        registerProducer(fn) {
            this._producers.push(fn);
        }

        * results() {
            yield* this._results;
        }

        runProducers() {
            this._producers.forEach(p => this._results.push(p()));
        }
    }

    //  VS6-SCOPING

    // Variables in ES6 are block scoped.
    it("variables-are-block-scoped", () => {
        let x = 1;

        if (x) {
            let y = 2;
        }

        let aggregator = new ResultAggregator();
        aggregator.addResult(x);
        expect(λ => aggregator.addResult(y)).toThrow();

        let generator = aggregator.results();
        expect(generator.next().value).toBe(1);
    });

    // No need for IIFE when the loop is block scoped.
    it("callback-does-not-need-IIFE", () => {
        let aggregator = new ResultAggregator();

        for (let i = 0; i < 10; ++i) {
            aggregator.registerProducer(λ => i);
        }

        aggregator.runProducers();

        let generator = aggregator.results();
        expect(generator.next().value).toBe(0);
        expect(generator.next().value).toBe(1);
        expect(generator.next().value).toBe(2);
        expect(generator.next().value).toBe(3);
        expect(generator.next().value).toBe(4);
        expect(generator.next().value).toBe(5);
        expect(generator.next().value).toBe(6);
        expect(generator.next().value).toBe(7);
        expect(generator.next().value).toBe(8);
        expect(generator.next().value).toBe(9);
    });

    // VS6-LAMBDA-THIS

    class TestThisInFunctions {
        constructor() {
            this.name = "Test Class";
        }

        usingFunction() {
            var fn = function() {
                expect(this).toBeUndefined();
            };

            fn();
        }

        usingLambda() {
            const lambda = λ => {
                expect(this.name).toBe("Test Class");
            };

            lambda();
        }
    }

    it("this-within-functions", () => {
        let test = new TestThisInFunctions();
        test.usingFunction();
        test.usingLambda();
    });
});



