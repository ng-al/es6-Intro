// Copyright (c) Alvin Pivowar 2016

/*
    JSON Schema is a standard way of describing JSON data format.
    Here, we will use it to define the "public" interface to a class.
    The handler will allow any request that the schema describes.
    Otherwise, it will appear to the caller that the rejected key is not in the object.

    This is used by the private by proxy test.

    Sample JSON Schema (see json-schema.org)
     {
        "title": "Example Schema",
        "type": "object",
        "properties": {
            "firstName": {
                "type": "string"
            },
            "lastName": {
                "type": "string"
            },
            "age": {
                "description": "Age in years",
                "type": "integer",
                "minimum": 0
            }
        },
        "required": ["firstName", "lastName"]
     }
 */

class JsonSchema {
    constructor(schema) {
        this.schema = schema;
    }

    getTypeOfKey(name) {
        return this.hasKey(name) ? this.schema.properties[name].type : undefined;
    }

    hasKey(name) {
        return this.schema && this.schema.properties && this.schema.properties[name];
    }
}

class JsonSchemaHandler {
    constructor(schema) {
        this.jsonSchema = new JsonSchema(schema);
    }

    get(target, property, receiver) {
        if (this.jsonSchema.hasKey(property)) {
            return (this.jsonSchema.getTypeOfKey(property) === "function")
                ? (...args) => Reflect.apply(target[property], target, args)
                : target[property];
        }

        return Reflect.get({}, property, receiver);
    }
}