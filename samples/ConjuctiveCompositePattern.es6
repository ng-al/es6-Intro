// Copyright (c) Alvin Pivowar 2016

class ConjunctionCompositePattern {
    constructor(methodName) {
        this.isInitialized = false;
        this.methodName = methodName;
        this.terms = [];
    }


    get(target, property, receiver) {
        this.initialize(target);
        const handler = this;

        if (property == this.methodName) return item => {
            for (let term of handler.terms) {
                if (!term[handler.methodName](item))
                    return false;
            }
            return true;
        };

        if (property == "add") return term => {
            handler.terms.push(term);
        };


        return Reflect.get(target, property, receiver);
    }

    initialize(target) {
        if (!this.isInitialized) {
            if (target && typeof(target[Symbol.iterator]) == "function")
                this.terms.push(...target);
            this.isInitialized = true;
        }
    }
}