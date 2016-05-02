"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Copyright (c) Alvin Pivowar 2016

var LazyPattern = function () {
    function LazyPattern() {
        _classCallCheck(this, LazyPattern);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        this.args = args;
        this.value = null;
    }

    _createClass(LazyPattern, [{
        key: "get",
        value: function get(factory, property, receiver) {
            if (property === "hasValue") return !!this.value;

            if (!this.value) this.value = Reflect.construct(factory, this.args);

            return property === "value" ? this.value : Reflect.get(this.value, property, receiver);
        }
    }]);

    return LazyPattern;
}();
