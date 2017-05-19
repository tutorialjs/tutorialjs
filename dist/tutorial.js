"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//v0.0.2

(function (window, document, undefined) {
    "use strict";

    var Util = function () {
        function Util() {
            _classCallCheck(this, Util);
        }

        _createClass(Util, null, [{
            key: "mandatory",
            value: function mandatory(param) {
                throw new Error(param + " is required.");
            }
        }]);

        return Util;
    }();

    var Tutorial = function () {
        function Tutorial(_ref) {
            var _this = this;

            var _ref$selector = _ref.selector,
                selector = _ref$selector === undefined ? "tut-action" : _ref$selector,
                _ref$selectorList = _ref.selectorList,
                selectorList = _ref$selectorList === undefined ? [] : _ref$selectorList,
                _ref$name = _ref.name,
                name = _ref$name === undefined ? Util.mandatory("Name") : _ref$name,
                _ref$persistent = _ref.persistent,
                persistent = _ref$persistent === undefined ? false : _ref$persistent,
                _ref$buttons = _ref.buttons,
                buttons = _ref$buttons === undefined ? {} : _ref$buttons,
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
                this._reset();

                this._name = name;
                this._persistent = persistent;
                this._advancedStorage = this._checkStorageSupport();
                this._step = parseInt(this._persistent ? this._getCurrentPosition() || 0 : 0);
                //this._basePosition = this.elems[0].getBoundingClientRect();

                this.selector = selector;
                this.buttons = buttons;
                this.animate = true;
                this.buttons = {
                    close: buttons.close === undefined ? 'Close' : buttons.close,
                    previous: buttons.previous === undefined ? 'Back' : buttons.close,
                    next: buttons.next === undefined ? 'Next' : buttons.close
                };
                this.debug = debug;

                this.animation = {
                    running: false,
                    id: null
                };

                this._body = document.getElementsByTagName("body")[0];
                this._blurElement = this._createBlurElement();

                var _createTutorialBox2 = this._createTutorialBox();

                var _createTutorialBox3 = _slicedToArray(_createTutorialBox2, 3);

                this._tutorialBox = _createTutorialBox3[0];
                this._tutorialText = _createTutorialBox3[1];
                this._tutorialPosition = _createTutorialBox3[2];

                this._highlightBox = this._createHighlightBox(this._tutorialBox);

                Object.defineProperty(this, "step", {
                    get: function get() {
                        return _this._step;
                    },
                    set: function set(x) {
                        _this._step = x;

                        if (_this._persistent) {
                            _this._saveCurrentPosition();
                        }
                    }
                });

                window.addEventListener("resize", function () {
                    if (!_this.running) return;

                    var first = _this.elems[0].getBoundingClientRect();
                    _this._highlightBox.classList.add("skip-animation");

                    _this._highlightBox.style.left = first.left - 12;
                    _this._highlightBox.style.top = first.top - 12;

                    _this._animateHighlightBox();

                    //debounce to remove after 200ms
                    _this._highlightBox.classList.remove("skip-animation");
                });
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
                    this._body.appendChild(this._highlightBox);

                    this._moveHighlightBox();
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

                this._highlightBox.style.transform = "";
                this._highlightBox.childNodes[0].style.transform = "";

                this._body.removeChild(this._blurElement);
                this._body.removeChild(this._highlightBox);

                this._reset();
            }
        }, {
            key: "prev",
            value: function prev() {
                if (!this.running) {
                    console.warn("Tutorial is not running");
                    return;
                } else if (this.animation.running) {
                    console.warn("Animation is already running");
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

                    this._moveHighlightBox();
                }

                this._saveCurrentPosition();
            }
        }, {
            key: "next",
            value: function next() {
                if (!this.running) {
                    console.warn("Tutorial is not running");
                    return;
                } else if (this.animation.running) {
                    console.warn("Animation is already running");
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

                    this._moveHighlightBox();
                }

                this._saveCurrentPosition();
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
                var _this2 = this;

                var el = document.createElement("div");
                el.classList.add("tutorial-blur");

                el.onclick = function () {
                    _this2.close();
                };

                return el;
            }
        }, {
            key: "_createHighlightBox",
            value: function _createHighlightBox(tutorialBox) {
                var el = document.createElement("div");
                var background = document.createElement("div");
                var index = document.createElement("i");

                el.classList.add("tutorial-wrapper");
                background.classList.add("tutorial-background");
                index.classList.add("tutorial-index");

                el.onlick = function (e) {
                    e.preventPropagation();
                };

                el.appendChild(background);
                el.appendChild(index);
                el.appendChild(tutorialBox);

                return el;
            }
        }, {
            key: "_createTutorialBox",
            value: function _createTutorialBox() {
                var _this3 = this;

                var wrapper = document.createElement("div");
                var edge = wrapper.cloneNode(false);
                var content_wrapper = wrapper.cloneNode(false);
                var text = document.createElement("p");
                var position = text.cloneNode();
                var buttonbox = wrapper.cloneNode(false);
                var close = document.createElement("button");
                var back = document.createElement("a");
                back.href = "#";
                var next = back.cloneNode(false);

                wrapper.classList.add("tutorial-box");
                edge.classList.add("tutorial-box-edge");
                content_wrapper.classList.add("tutorial-box-wrapper");
                text.classList.add("tutorial-description");
                position.classList.add("tutorial-step-position");
                buttonbox.classList.add("tutorial-buttons");

                close.textContent = this.buttons.close;
                back.textContent = this.buttons.previous;
                next.textContent = this.buttons.next;

                close.onclick = function (e) {
                    e.preventDefault();

                    _this3.close();
                };
                back.onclick = function (e) {
                    e.preventDefault();

                    _this3.prev();
                };

                next.onclick = function (e) {
                    e.preventDefault();

                    _this3.next();
                };

                buttonbox.appendChild(close);
                buttonbox.appendChild(back);
                buttonbox.appendChild(next);

                content_wrapper.appendChild(text);
                content_wrapper.appendChild(position);
                content_wrapper.appendChild(buttonbox);

                wrapper.appendChild(edge);
                wrapper.appendChild(content_wrapper);

                return [wrapper, text, position];
            }
        }, {
            key: "_moveHighlightBox",
            value: function _moveHighlightBox() {
                if (this.running && this.animate) {
                    this._animateHighlightBox();
                } else {
                    //remove dup
                    var bounds = this.elems[this.step].getBoundingClientRect();

                    this._highlightBox.style.top = bounds.top - 12;
                    this._highlightBox.style.left = bounds.left - 12;
                    this._highlightBox.childNodes[0].style.height = bounds.bottom - bounds.top + 24;
                    this._highlightBox.childNodes[0].style.width = bounds.width + 24;

                    this._tutorialBox.style.top = bounds.height + 30 + "px";
                }

                this._highlightBox.childNodes[1].innerText = this.step + 1;
                this._tutorialPosition.textContent = this.step + 1 + "/" + this.elems.length;
            }
        }, {
            key: "_animateHighlightBox",
            value: function _animateHighlightBox() {
                var _this4 = this;

                //flip technique
                //https://aerotwist.com/blog/flip-your-animations/
                var first = this.elems[0].getBoundingClientRect();
                var last = this.elems[this.step].getBoundingClientRect();
                //let cur   = this._highlightBox.getBoundingClientRect();

                this._transform.translateY = last.top - first.top;
                this._transform.translateX = last.left - first.left;
                this._transform.scaleY = (last.height + 24) / (first.height + 24);
                this._transform.scaleX = (last.width + 24) / (first.width + 24);

                //use transform or not ?
                this._tutorialBox.style.top = last.height + 30 + "px";

                this._highlightBox.style.transform = "translateX(" + this._transform.translateX + "px) translateY(" + this._transform.translateY + "px)";
                this._highlightBox.childNodes[0].style.transform = "scaleX(" + this._transform.scaleX + ") scaleY(" + this._transform.scaleY + ")";

                this._highlightBox.addEventListener("transitionend", function () {
                    _this4.animation.running = false;
                });
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
        }, {
            key: "_checkStorageSupport",
            value: function _checkStorageSupport() {
                try {
                    localStorage.setItem("a", 1);
                    localStorage.removeItem("a");
                    return true;
                } catch (e) {
                    return false;
                }
            }
        }, {
            key: "_saveCurrentPosition",
            value: function _saveCurrentPosition() {
                if (this._advancedStorage) {
                    window.localStorage.setItem("tutorial-" + this._name, this.step);
                } else {
                    document.cookie += "tutorial-" + this._name + "=" + this.step + ";";
                }
            }
        }, {
            key: "_getCurrentPosition",
            value: function _getCurrentPosition() {
                var _this5 = this;

                if (this._advancedStorage) {
                    return window.localStorage.getItem("tutorial-" + this._name);
                } else {
                    return document.cookie.split(",").filter(function (item) {
                        return item.includes("tutorial-" + _this5._name);
                    }).map(function (item) {
                        return parseInt(item.replace("tutorial-" + _this5._name + "=", ""));
                    });
                }
            }
        }, {
            key: "_reset",
            value: function _reset() {
                this.step = 0;
                this.running = false;

                this._transform = {
                    translateY: 0,
                    translateX: 0,
                    scaleX: 0,
                    scaleY: 0
                };
            }
        }]);

        return Tutorial;
    }();

    if (!window.Tutorial) {
        window.Tutorial = Tutorial;
    }
})(window, document);