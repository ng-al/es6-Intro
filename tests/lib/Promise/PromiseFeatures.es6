// Copyright (c) Alvin Pivowar 2016

describe("es6-promise-features", () => {
    it("promise-resolve", () => {
        const service = λ => new Promise((resolve, reject) => { resolve("I succeeded"); });

        let result = service().then(function(data) {
            expect(data).toBe("I succeeded");
        }, function(error) {
            fail();
        });
    });

    it("promise-reject", () => {
        const service = λ => new Promise((resolve, reject) => { reject("I failed"); });

        let result = service().then(function(data) {
            fail();
        }, function(error) {
            expect(error).toBe("I failed");
        });
    });

    it("promise-catch", () => {
        const service = λ => new Promise((resolve, reject) => { resolve("I succeeded"); });

        let result = service()
            .then(function(data) {
                expect(data).toBe("I succeeded");
                throw "Catch it!";
            }, function(error) {
                fail();
            })
            .catch(function(error) {
                expect(error).toBe("Catch it!");
            });
    });

    // All must resolve
    it("Promise-all-resolve", () => {
        const service1 = λ => new Promise((resolve, reject) => { setTimeout(λ => resolve("service1"), 1000); });
        const service2 = λ => new Promise((resolve, reject) => { setTimeout(λ => resolve("service2"), 2000); });

        Promise.all([service2(), service1()]).then(function(data) {
            expect(data).toBe("service1");
        }, function(error) {
            fail();
        });
    });

    it("Promise-all-reject", () => {
        const service1 = λ => new Promise((resolve, reject) => { setTimeout(λ => resolve("service1"), 1000); });
        const service2 = λ => new Promise((resolve, reject) => { setTimeout(λ => reject("service2"), 2000); });

        Promise.all([service2(), service1()]).then(function(data) {
            fail();
        }, function(error) {
            expect(error).toBe("service2");
        });
    });

    // The outcome is the first promise that either resolves or rejects.
    it("Promise-race-1", () => {
        const service1 = λ => new Promise((resolve, reject) => { setTimeout(λ => resolve("service1"), 1000); });
        const service2 = λ => new Promise((resolve, reject) => { setTimeout(λ => resolve("service2"), 2000); });

        Promise.all([service2(), service1()]).then(function(data) {
            expect(data).toBe("service1");
        }, function(error) {
            fail();
        });
    });

    it("Promise-race-2", () => {
        const service1 = λ => new Promise((resolve, reject) => { setTimeout(λ => resolve("service1"), 1000); });
        const service2 = λ => new Promise((resolve, reject) => { setTimeout(λ => reject("service2"), 2000); });

        Promise.all([service2(), service1()]).then(function(data) {
            expect(data).toBe("service1");
        }, function(error) {
            fail();
        });
    });

    it("Promise-race-3", () => {
        const service1 = λ => new Promise((resolve, reject) => { setTimeout(λ => reject("service1"), 1000); });
        const service2 = λ => new Promise((resolve, reject) => { setTimeout(λ => resolve("service2"), 2000); });

        Promise.all([service2(), service1()]).then(function(data) {
            fail();
        }, function(error) {
            expect(error).toBe("service1");
        });
    });

    it("Promise-race-4", () => {
        const service1 = λ => new Promise((resolve, reject) => { setTimeout(λ => reject("service1"), 1000); });
        const service2 = λ => new Promise((resolve, reject) => { setTimeout(λ => reject("service2"), 2000); });

        Promise.all([service2(), service1()]).then(function(data) {
            fail();
        }, function(error) {
            expect(error).toBe("service1");
        });
    });

    it("Promise-reject", () => {
        const service = λ => Promise.reject("I always fail");

        service().then(function(data) {
            fail();
        }, function(error) {
            expect(error).toBe("I always fail");
        });
    });

    it("Promise-resolve", () => {
        const service = λ => Promise.resolve("I never fail");

        service().then(function(data) {
            expect(data).toBe("I never fail");
        }, function(error) {
            fail();
        });
    });
});