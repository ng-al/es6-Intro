"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Copyright (c) Alvin Pivowar 2016

var MultipleInheritance = function () {
    function MultipleInheritance() {
        _classCallCheck(this, MultipleInheritance);

        this.isInitalized = false;
        this.prototypes = [];
    }

    _createClass(MultipleInheritance, [{
        key: "executeGet",
        value: function executeGet(prototype, property, receiver) {
            return typeof prototype[property] === "function" ? function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return Reflect.apply(prototype[property], prototype, args);
            } : Reflect.get(prototype, property, receiver);
        }
    }, {
        key: "findByName",
        value: function findByName(property, receiver) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.prototypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var prototype = _step.value;

                    if (Reflect.has(prototype, property)) return this.executeGet(prototype, property, receiver);
                }

                // This will throw a not-found error.
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return Reflect.get({}, property, receiver);
        }
    }, {
        key: "findBySymbol",
        value: function findBySymbol(discriminatedProperty, receiver) {
            var $$className = Symbol.for("className");

            var _discriminatedPropert = discriminatedProperty.split("ϵ"),
                _discriminatedPropert2 = _slicedToArray(_discriminatedPropert, 2),
                property = _discriminatedPropert2[0],
                discriminator = _discriminatedPropert2[1];

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {

                for (var _iterator2 = this.prototypes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var prototype = _step2.value;

                    if (Reflect.has(prototype, $$className) && prototype[$$className].toLowerCase() === discriminator.toLowerCase()) {

                        return this.executeGet(prototype, property, receiver);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return Reflect.get({}, property, receiver);
        }
    }, {
        key: "get",
        value: function get(target, property, receiver) {
            this.initialize(target);

            return property.includes("ϵ") ? this.findBySymbol(property, receiver) : this.findByName(property, receiver);
        }
    }, {
        key: "initialize",
        value: function initialize(target) {
            if (!this.isInitalized) {
                var _prototypes;

                if (target && typeof target[Symbol.iterator] == "function") (_prototypes = this.prototypes).push.apply(_prototypes, _toConsumableArray(target));
                this.isInitalized = true;
            }
        }
    }]);

    return MultipleInheritance;
}();
