"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*       */

(function (window, document, undefined) {
    var KB = function () {
        function KB() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref$identifier = _ref.identifier,
                identifier = _ref$identifier === undefined ? "kb" : _ref$identifier,
                _ref$debug = _ref.debug,
                debug = _ref$debug === undefined ? true : _ref$debug;

            _classCallCheck(this, KB);

            this.identifier = identifier;
            this.debug = debug;
            this.step = 0;

            this.elems = Array.from(document.getElementsByClassName(this.identifier));

            if (this.elems.length === 0) {
                throw new Error("No activitys point defined");
            } else if (!this.elems.every(function (el) {
                return el.getAttribute("kb-step");
            })) {
                throw new Error("Not all steps defined");
            } else {
                this.elems.sort(function (a, b) {
                    return parseInt(a.getAttribute("kb-step")) - parseInt(b.getAttribute("kb-step"));
                });

                console.log(this.elems);
            }
        }

        _createClass(KB, [{
            key: "start",
            value: function start() {}
        }, {
            key: "goToStep",
            value: function goToStep(step) {}
        }]);

        return KB;
    }();

    if (!window.KB) {
        window.KB = KB;
    }
})(window, document);