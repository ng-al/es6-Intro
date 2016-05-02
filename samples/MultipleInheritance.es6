// Copyright (c) Alvin Pivowar 2016

class MultipleInheritance {
    constructor() {
        this.isInitalized = false;
        this.prototypes = [];
    }

    executeGet(prototype, property, receiver) {
        return (typeof(prototype[property]) === "function")
            ? (...args) => Reflect.apply(prototype[property], prototype, args)
            : Reflect.get(prototype, property, receiver);
    }

    findByName(property, receiver) {
        for (let prototype of this.prototypes) {
            if (Reflect.has(prototype, property))
                return this.executeGet(prototype, property, receiver);
        }

        // This will throw a not-found error.
        return Reflect.get({}, property, receiver);
    }

    findBySymbol(discriminatedProperty, receiver) {
        const $$className = Symbol.for("className");
        let [property, discriminator] = discriminatedProperty.split("ϵ");

        for (let prototype of this.prototypes) {
            if (Reflect.has(prototype, $$className) &&
                prototype[$$className].toLowerCase() === discriminator.toLowerCase()) {

                return this.executeGet(prototype, property, receiver);
            }
        }

        return Reflect.get({}, property, receiver);
    }


    get(target, property, receiver) {
        this.initialize(target);

        return (property.includes("ϵ"))
            ? this.findBySymbol(property, receiver)
            : this.findByName(property, receiver);
    }

    initialize(target) {
        if (!this.isInitalized) {
            if (target && typeof(target[Symbol.iterator]) == "function")
                this.prototypes.push(...target);
            this.isInitalized = true;
        }
    }
}