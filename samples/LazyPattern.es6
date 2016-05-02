// Copyright (c) Alvin Pivowar 2016

class LazyPattern {
    constructor(...args) {
        this.args = args;
        this.value = null;
    }

    get(factory, property, receiver) {
        if (property === "hasValue")
            return !!this.value;

        if (!this.value)
            this.value = Reflect.construct(factory, this.args);

        return (property === "value")
            ? this.value
            : Reflect.get(this.value, property, receiver);
    }
}