"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//v0.0.1

(function (window, document, undefined) {
    "use strict";

    var Tutorial = function () {
        function Tutorial() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref$selector = _ref.selector,
                selector = _ref$selector === undefined ? "tut-action" : _ref$selector,
                _ref$selectorList = _ref.selectorList,
                selectorList = _ref$selectorList === undefined ? [] : _ref$selectorList,
                _ref$debug = _ref.debug,
                debug = _ref$debug === undefined ? false : _ref$debug;

            _classCallCheck(this, Tutorial);

            if (selectorList.length > 0) {
                this.elems = this._queryElementList(selectorList);
            } else {
                this.elems = Array.from(document.getElementsByClassName(selector));

                if (!this.elems.every(function (el) {
                    return el.getAttribute("t-step");
                })) {
                    throw new Error("Not all steps defined");
                } else {
                    this.elems.sort(function (a, b) {
                        return parseInt(a.getAttribute("t-step")) - parseInt(b.getAttribute("t-step"));
                    });
                }
            }

            if (this.elems.length === 0) {
                throw new Error("No activities point defined");
            } else {
                this.selector = selector;
                this.debug = debug;
                this.step = 0;
                this.running = false;

                this._body = document.getElementsByTagName("body")[0];
                this._blurElement = this._createBlurElement();
                this._highlightBackground = this._createHighlightBackground();
            }
        }

        _createClass(Tutorial, [{
            key: "start",
            value: function start() {
                if (this.debug) console.log("Tutorial started...");

                if (this.running) {
                    console.warn("Tutorial instance already running");
                } else {
                    this.elems[this.step].classList.add("tutorial-highlight");

                    this._body.appendChild(this._blurElement);
                    this._body.appendChild(this._highlightBackground);

                    this._moveHighlightBackground();
                    this.running = true;
                }
            }
        }, {
            key: "close",
            value: function close() {
                if (!this.running) {
                    console.warn("Tutorial is not running");
                    return;
                }

                this.elems[this.step].classList.remove("tutorial-highlight");

                this._body.removeChild(this._blurElement);
                this._body.removeChild(this._highlightBackground);

                this.running = false;
                this.step = 0;
            }
        }, {
            key: "prev",
            value: function prev() {
                if (!this.running) {
                    console.warn("Tutorial is not running");
                    return;
                }

                if (this.debug) console.log("Going to previous element: #" + this.step);

                //at first step
                if (this.step === 0) {
                    //or throw error;
                    this.close();
                } else {
                    this.elems[this.step].classList.remove("tutorial-highlight");
                    this.elems[--this.step].classList.add("tutorial-highlight");

                    this._moveHighlightBackground();
                }
            }
        }, {
            key: "next",
            value: function next() {
                if (!this.running) {
                    console.warn("Tutorial is not running");
                    return;
                }

                if (this.debug) console.log("Going to next element: #" + this.step);

                //last step?
                if (this.step === this.elems.length - 1) {
                    //or throw error;
                    this.close();
                } else {
                    this.elems[this.step].classList.remove("tutorial-highlight");
                    this.elems[++this.step].classList.add("tutorial-highlight");

                    this._moveHighlightBackground();
                }
            }

            //even if is not running?

        }, {
            key: "goToStep",
            value: function goToStep(step) {
                if (!this.running) {
                    console.warn("Tutorial is not running.");
                    return;
                } else if (!this._stepInBounds(step)) {
                    throw new Error("Step out of bounds.");
                } else if (step === this.step) {
                    return;
                }

                this.elems[this.step].classList.remove("tutorial-highlight");
                this.step = step;
                this.elems[this.step].classList.add("tutorial-highlight");
            }
        }, {
            key: "_stepInBounds",
            value: function _stepInBounds(step) {
                return step >= 0 && step < this.elems.length;
            }
        }, {
            key: "_createBlurElement",
            value: function _createBlurElement() {
                var el = document.createElement("div");
                el.classList.add("tutorial-blur");
                return el;
            }
        }, {
            key: "_createHighlightBackground",
            value: function _createHighlightBackground() {
                var el = document.createElement("div");
                var index = document.createElement("i");

                index.classList.add("tutorial-index");

                el.classList.add("tutorial-wrapper");
                el.appendChild(index);

                return el;
            }
        }, {
            key: "_moveHighlightBackground",
            value: function _moveHighlightBackground() {
                var bounds = this.elems[this.step].getBoundingClientRect();

                this._highlightBackground.style.top = bounds.top - 12;
                this._highlightBackground.style.left = bounds.left - 12;
                this._highlightBackground.style.height = bounds.bottom - bounds.top + 24;
                this._highlightBackground.style.width = bounds.width + 24;

                this._highlightBackground.childNodes[0].innerText = this.step + 1;
            }
        }, {
            key: "_queryElementList",
            value: function _queryElementList(list) {
                var nodes = [];
                var node = null;

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var elem = _step.value;

                        //get if getElement gets more than 1 elem
                        switch (elem.charAt(0)) {
                            case ".":
                                node = document.getElementsByClassName(elem.substr(1, this.length))[0];
                                break;
                            case "#":
                                node = document.getElementById(elem.substr(1, this.length));
                                break;
                            default:
                                throw new Error("Unknown selector. Please only use id or class.");
                                break;
                        }

                        nodes.push(node);
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

                return nodes;
            }
        }]);

        return Tutorial;
    }();

    if (!window.Tutorial) {
        window.Tutorial = Tutorial;
    }
})(window, document);