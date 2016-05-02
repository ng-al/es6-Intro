"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Copyright (c) Alvin Pivowar 2016

var ConjunctionCompositePattern = function () {
    function ConjunctionCompositePattern(methodName) {
        _classCallCheck(this, ConjunctionCompositePattern);

        this.isInitialized = false;
        this.methodName = methodName;
        this.terms = [];
    }

    _createClass(ConjunctionCompositePattern, [{
        key: "get",
        value: function get(target, property, receiver) {
            this.initialize(target);
            var handler = this;

            if (property == this.methodName) return function (item) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = handler.terms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var term = _step.value;

                        if (!term[handler.methodName](item)) return false;
                    }
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

                return true;
            };

            if (property == "add") return function (term) {
                handler.terms.push(term);
            };

            return Reflect.get(target, property, receiver);
        }
    }, {
        key: "initialize",
        value: function initialize(target) {
            if (!this.isInitialized) {
                var _terms;

                if (target && typeof target[Symbol.iterator] == "function") (_terms = this.terms).push.apply(_terms, _toConsumableArray(target));
                this.isInitialized = true;
            }
        }
    }]);

    return ConjunctionCompositePattern;
}();
