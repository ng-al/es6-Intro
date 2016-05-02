"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var JsonSchema = function () {
    function JsonSchema(schema) {
        _classCallCheck(this, JsonSchema);

        this.schema = schema;
    }

    _createClass(JsonSchema, [{
        key: "getTypeOfKey",
        value: function getTypeOfKey(name) {
            return this.hasKey(name) ? this.schema.properties[name].type : undefined;
        }
    }, {
        key: "hasKey",
        value: function hasKey(name) {
            return this.schema && this.schema.properties && this.schema.properties[name];
        }
    }]);

    return JsonSchema;
}();

var JsonSchemaHandler = function () {
    function JsonSchemaHandler(schema) {
        _classCallCheck(this, JsonSchemaHandler);

        this.jsonSchema = new JsonSchema(schema);
    }

    _createClass(JsonSchemaHandler, [{
        key: "get",
        value: function get(target, property, receiver) {
            if (this.jsonSchema.hasKey(property)) {
                return this.jsonSchema.getTypeOfKey(property) === "function" ? function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    return Reflect.apply(target[property], target, args);
                } : target[property];
            }

            return Reflect.get({}, property, receiver);
        }
    }]);

    return JsonSchemaHandler;
}();
